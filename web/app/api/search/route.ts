import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

/* 
 * API Route: /api/search
 * Handles the "Visual RAG" logic.
 * 1. Embeds the search word.
 * 2. Retrieves real historical context from Pinecone.
 * 3. Uses Groq (Llama 3.3) to synthesize a narrative based on the retrieved archive.
 */

// Schema
const searchSchema = z.object({
    breakdown: z.array(z.object({
        part: z.string(),
        meaning: z.string(),
        color: z.string().optional()
    })),
    literal_meaning: z.string(),
    mnemonic: z.string(),
    visual_contrast_prompt: z.string(),
    story: z.string(),
    root: z.string(),
    root_concept: z.string(),
    scenes: z.array(z.object({
        scene_index: z.number(),
        prompt: z.string()
    })),
    video_prompt: z.string().optional()
});

// Clients
const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

const PINECONE_INDEX = process.env.PINECONE_INDEX || 'le-clef-mot';

async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
        dimensions: 512,
    });
    return response.data[0].embedding;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        console.log(`[API] Processing RAG search for: ${word}`);

        // 1. Retrieve Context (The Archivist's Lookup)
        let contextText = "No specific historical archives found. Use general etymological knowledge.";
        let retrievedImage = null;

        if (process.env.PINECONE_API_KEY) {
            try {
                const vector = await getEmbedding(word + " etymology history origin");
                const index = pinecone.index(PINECONE_INDEX);
                const results = await index.query({
                    vector: vector,
                    topK: 1,
                    includeMetadata: true
                });

                if (results.matches && results.matches.length > 0) {
                    const match = results.matches[0];
                    if (match.metadata) {
                        retrievedImage = match.metadata.url as string;
                        contextText = `
                        ARCHIVE FOUND:
                        - Description: ${match.metadata.description}
                        - Era: ${match.metadata.era_markers || 'Unknown'}
                        - Mood: ${match.metadata.mood || 'Neutral'}
                        - Image URL: ${match.metadata.url}
                        
                        INSTRUCTION: Use this SPECIFIC archive to ground your story. The 'root' of the word is metaphorically linked to this object/scene.
                        `;
                        console.log("RAG Hit:", match.metadata.description);
                    }
                }
            } catch (err) {
                console.error("Pinecone Retrieval Error:", err);
            }
        }

        // 2. Generate Narrative (The Curator's Explanation)
        const SYSTEM_PROMPT = `
        You are 'L'Archiviste', a custodian of visual history.
        
        CONTEXT:
        ${contextText}

        TASK:
        Analyze the word "${word}". 
        If an archive was provided in CONTEXT, you MUST weave it into the 'story' and 'visual_contrast_prompt'. 
        If NO archive is found, create a 'visual_contrast_prompt' describing a specific, plausible 18th/19th-century engraving or woodcut that serves as a visual metaphor.
        
        Claim this specific image shows the true origin of the word.
        
        Output JSON matching this format (do not use markdown):
        {
          "breakdown": [{ "part": "Part", "meaning": "Meaning", "color": "red" }],
          "literal_meaning": "...",
          "mnemonic": "...",
          "visual_contrast_prompt": "Describe the ARCHIVE found in context explicitly.",
          "video_prompt": "Cinematic pan of the ARCHIVE scene...",
          "story": "A short 3-sentence story connecting the word to the archive.",
          "root": "Ancient Root",
          "root_concept": "Root Meaning",
          "scenes": [
             {"scene_index": 0, "prompt": "Scene description..."}
          ]
        }
        `;

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: `Analyze the visual etymology of: "${word}"`,
            system: SYSTEM_PROMPT,
            temperature: 0.5,
        });

        // 3. Clean & Parse
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

        const aiData = searchSchema.parse(JSON.parse(jsonString));

        // 4. Assemble Response (Prefer Real Archive over Gen)
        const finalImage = retrievedImage || aiData.visual_contrast_prompt; // If no real image, this might need a fallback, but frontend handles strings? 
        // Actually, if retrievedImage is null, we might still want to generate one? 
        // The user said "Visual RAG" replaces production.
        // Let's pass the retrieved URL if it exists, otherwise leave it empty/placeholder or generate?
        // For now, let's assume we want valid URLs. If RAG fails, we might still fallback to Fal?
        // User said: "Advantage: real reference images... solves stability issue".
        // So we strictly prefer REtrieved image.

        // Use Fal ONLY if RAG failed? Or strictly retrieved?
        // Let's stick to retrieved for "visual_subject" reference.

        let imageUrl = retrievedImage || "/placeholder.jpg";

        // If RAG failed, maybe fall back to Fal generation?
        if (!retrievedImage && process.env.FAL_KEY) {
            // Fallback to Generation using Recraft V3 for "Archival" style
            try {
                const falResponse = await fetch("https://fal.run/fal-ai/recraft-v3", {
                    method: "POST",
                    headers: { "Authorization": `Key ${process.env.FAL_KEY}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: `${aiData.visual_contrast_prompt || aiData.root_concept}. Vintage engraving, centered, etching style, high contrast, historical diagram.`,
                        image_size: "landscape_4_3",
                        style: "engraving" // Recraft specific style if supported, or rely on prompt
                    })
                });
                const falData = await falResponse.json();
                if (falData.images?.[0]?.url) imageUrl = falData.images[0].url;
            } catch (e) { console.error("Fal Fallback Error", e); }
        }

        const responseData = {
            word: word,
            breakdown: aiData.breakdown || [],
            literal_meaning: aiData.literal_meaning || "Unknown",
            mnemonic: aiData.mnemonic || "",
            root: aiData.root,
            root_concept: aiData.root_concept,
            story: aiData.story,
            visual_subject: aiData.visual_contrast_prompt,
            video_prompt: aiData.video_prompt,
            image_query: "RAG Retrieval",
            image_url: imageUrl,
            scenes: (aiData.scenes || []).map((s: any) => ({ ...s, video_uri: "" }))
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error("Global API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

