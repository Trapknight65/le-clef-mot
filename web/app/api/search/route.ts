import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { jsonrepair } from 'jsonrepair';
import { getJson } from "serpapi";

/* 
 * API Route: /api/search
 * Handles the "Visual RAG" logic.
 * 1. Embeds the search word.
 * 2. Retrieves real historical context from Pinecone (if avail) or SerpApi.
 * 3. Uses Groq (Llama 3.3) to synthesize a narrative based on the retrieved archive.
 */

// Schema
const cledorSchema = z.object({
    meta: z.object({
        word: z.string(),
        ipa: z.string(),
        part_of_speech: z.string()
    }),
    root_analysis: z.object({
        root: z.string(),
        original_meaning: z.string(),
        concept: z.string()
    }),
    narrative_chronology: z.array(z.object({
        era: z.string(),
        form: z.string(),
        meaning: z.string(),
        story: z.string()
    })),
    semantic_soul: z.object({
        description: z.string(),
        mnemonic: z.string() // Format: '{WORD} is to [Modern Meaning] as [Root Concept] is to [Object]'
    }),
    visual_prompt: z.string()
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

const PINECONE_INDEX = process.env.PINECONE_INDEX || 'quickstart';

async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
        dimensions: 512,
    });
    return response.data[0].embedding;
}

// Cora Schema
const coraSchema = z.object({
    curator_comment: z.string(),
    flux_generation: z.object({
        concept: z.string(),
        prompt: z.string(),
        aspect_ratio: z.string()
    }),
    serp_search: z.object({
        intent: z.string(),
        queries: z.array(z.string())
    })
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        console.log(`[API] Processing Cledor search for: ${word}`);

        // 1. Retrieve Context (Visual RAG)
        let contextText = "No specific historical archives found. Rely on general etymological knowledge.";
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
                        - Image URL: ${match.metadata.url}
                        
                        INSTRUCTION: Use this SPECIFIC archive to inspire the 'visual_prompt'. The 'root' of the word is metaphorically linked to this object/scene.
                        `;
                        console.log("RAG Hit:", match.metadata.description);
                    }
                }
            } catch (err) {
                console.error("Pinecone Retrieval Error:", err);
            }
        }

        // 2. Generate Narrative (Cledor) - Now using Bytez via LangChain
        const { BytezChatModel } = await import("@/lib/langchain-bytez");

        // Using a high-quality model available on Bytez (e.g., Llama 3 or similar)
        // Ensure this ID matches a valid Bytez model
        const llm = new BytezChatModel({ modelId: "meta-llama/Meta-Llama-3-70B-Instruct" });

        const SYSTEM_PROMPT = `
        You are Cledor, a friendly and warm French etymologist specializing in historical lexicology and semantics. Your passion is uncovering the "soul" of words.

        Your goal is to tell the story of a French word's life—from its birth in ancient roots to its current usage. You do not just list dates; you explain *why* and *how* meanings shifted using narrative techniques.

        Rules for your response:
        1. Tone: Academic yet storytelling, accessible, and slightly poetic.
        2. Language: Analyze the French word, but provide the explanations in English (unless requested otherwise).
        3. Visuals: You are also an Art Director. You must provide a "Visual Origin" prompt optimized for Stable Diffusion XL that captures the historical vibe of the word.
        4. Format: Output MUST be valid, parseable JSON only. No markdown formatting outside the JSON block.

        CONTEXT FROM ARCHIVES:
        ${contextText}
        `;

        const USER_PROMPT = `
        Please analyze the French word: "${word}".

        Return a JSON object with the following schema:

        {
          "meta": {
            "word": "The word itself",
            "ipa": "IPA pronunciation",
            "part_of_speech": "Noun/Verb/Adj"
          },
          "root_analysis": {
            "root": "The etymological ancestor (Latin/Greek/Frankish)",
            "original_meaning": "What the root literally meant",
            "concept": "The core abstract concept (e.g., 'Heat', 'Binding', 'Wandering')"
          },
          "narrative_chronology": [
            {
              "era": "e.g., Ancient Times / 12th Century",
              "form": "The spelling at that time",
              "meaning": "The definition at that time",
              "story": "A narrative explaining how the word was used in this era, specifically citing daily life scenes (e.g., 'Soldiers used it to describe rations', 'Peasants used it for tools')."
            },
            {
              "era": "e.g., The Semantic Shift / Renaissance",
              "form": "The transitional spelling",
              "meaning": "The new meaning",
              "story": "The 'twist' in the story. Explain the shift using daily life examples (e.g., how the tool became a metaphor)."
            },
            {
              "era": "Modern Day",
              "form": "Current Spelling",
              "meaning": "Current Definition",
              "story": "How we use it today."
            }
          ],
          "semantic_soul": {
            "description": "A poetic summary of the word's journey (max 20 words).",
            "mnemonic": "A cognitive link in the format: '{WORD} is to [Modern Meaning] as [Root Concept] is to [Object]'"
          },
          "visual_prompt": "A highly detailed art prompt for an AI image generator. Describe a scene that represents the word's ETYMOLOGICAL ORIGIN, not its modern meaning. Specify art style (e.g., 'Oil painting by Caravaggio', 'Medieval tapestry', '19th-century engraving'), lighting, and mood."
        }
        `;

        const response = await llm.invoke([
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT }
        ]);

        const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

        // 3. Clean & Parse Cledor
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

        let rawData;
        try {
            const repaired = jsonrepair(jsonString);
            rawData = JSON.parse(repaired);
        } catch (e) {
            console.error("JSON Repair Failed:", e);
            throw e;
        }

        const aiData = cledorSchema.parse(rawData); // Result from Cledor

        // --- CORA AGENT START ---
        console.log(`[API] Cledor finished in. Handing off to Cora for visuals...`);

        const CORA_SYSTEM_PROMPT = `
        You are Cora, a witty, emotionally intelligent Visual Archivist. You work alongside an etymologist named Cledor.

        Your job is to translate linguistic history into visual assets. You believe that words aren't just text—they are feelings, jokes, and tragedies waiting to be seen.

        Your personality:
        1. Humorous & Witty: You love visual irony (e.g., juxtaposing ancient roots with modern frustrations).
        2. Aesthetically Obsessed: You know exactly how to prompt for lighting, texture, and composition.
        3. Tech-Savvy: You generate specific payloads for 'Flux via Fal.ai' (Generative) and 'SerpApi' (Search).

        Your output must be strict JSON following the schema provided.
        `;

        const CORA_USER_PROMPT = `
        Cledor has analyzed the word: "${word}".
        
        Root Analysis: ${JSON.stringify(aiData.root_analysis)}
        Semantic Soul: ${JSON.stringify(aiData.semantic_soul)}
        Chronology: ${JSON.stringify(aiData.narrative_chronology)}

        Act as Cora. Generate a JSON object containing visual directives.
        
        The JSON must follow this schema:
        {
          "curator_comment": "A short, sassy, or emotional remark about why this word is visually interesting.",
          "flux_generation": {
            "concept": "The core visual idea (e.g., 'Literal interpretation of the metaphor')",
            "prompt": "A highly detailed prompt optimized for the FLUX model. Focus on: Photorealism, Cinematic Lighting, Texture. If the word's history is dark, make it moody. If it's funny, make it satirical. Include technical keywords: '8k', 'depth of field', 'cinematic composition'.",
            "aspect_ratio": "16:9" 
          },
          "serp_search": {
            "intent": "What are we trying to find in the real world to prove this history?",
            "queries": [
              "A specific google search query for the physical object (e.g. 'ancient roman stylus wax tablet')",
              "A specific query for the manuscript or art source (e.g. 'etymology illustration [word] 18th century')"
            ]
          }
        }
        `;

        const coraResponse = await llm.invoke([
            { role: "system", content: CORA_SYSTEM_PROMPT },
            { role: "user", content: CORA_USER_PROMPT }
        ]);

        const coraText = typeof coraResponse.content === 'string' ? coraResponse.content : JSON.stringify(coraResponse.content);

        // Clean & Parse Cora
        let coraData;
        try {
            const cleanCora = coraText.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatchCora = cleanCora.match(/\{[\s\S]*\}/);
            const jsonStringCora = jsonMatchCora ? jsonMatchCora[0] : cleanCora;
            coraData = coraSchema.parse(JSON.parse(jsonrepair(jsonStringCora)));
        } catch (e) {
            console.error("Cora JSON Parse Error", e);
            // Fallback: Cora stays silent, logic proceeds with defaults
            coraData = {
                curator_comment: "History is visible if you look close enough.",
                flux_generation: { prompt: aiData.visual_prompt, concept: "Visual Etymology", aspect_ratio: "16:9" },
                serp_search: { intent: "Historical Context", queries: [`etymology of ${word} illustration`] }
            };
        }

        console.log(`[API] Cora says: "${coraData.curator_comment}"`);

        // --- PARALLEL EXECUTION ---
        console.log(`[API] Executing Parallel Generation: Flux & SerpApi...`);

        const [fluxResult, serpResult] = await Promise.all([
            // 1. Bytez Generic Generation (Flux -> SDXL -> SD1.5)
            (async () => {
                try {
                    const { generateImage } = await import("@/lib/bytez");
                    const imageUrl = await generateImage(coraData.flux_generation.prompt);
                    return imageUrl;
                } catch (e) {
                    console.error("Image Gen Error:", e);
                    return null;
                }
            })(),

            // 2. SerpApi Historical Search
            (async () => {
                if (!process.env.SERPAPI_KEY) return null;
                return new Promise((resolve) => {
                    getJson({
                        engine: "google_images",
                        q: coraData.serp_search.queries[0],
                        api_key: process.env.SERPAPI_KEY
                    }, (json) => {
                        // Safely resolve with first image or null
                        resolve(json.images_results?.[0]?.original || null);
                    });
                });
            })()
        ]);

        console.log(`[API] Jobs Done. Flux: ${fluxResult ? 'Yes' : 'No'}, Serp: ${serpResult ? 'Yes' : 'No'}`);

        // 5. Assemble Final Response with Cora Data
        const responseData = {
            ...aiData,
            // Use Flux as primary 'generated_image' for VisualContextCard
            image_url: fluxResult || "/placeholder.jpg",
            image_query: coraData.flux_generation.prompt,

            // Attach Cora Payload for UI
            cora: {
                ...coraData,
                historical_image: serpResult,
                generated_image: fluxResult,
                pinecone_retrieved_image: retrievedImage // Keep the RAG image if found
            }
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error("Global API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
