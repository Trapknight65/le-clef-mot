import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { jsonrepair } from 'jsonrepair';
import { EtymologyData } from '@/lib/types';

// Schema Definition (Mirrored from original route)
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
        mnemonic: z.string()
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

export async function generateEtymology(word: string): Promise<EtymologyData> {
    console.log(`[Cledor] Analysis starting for: ${word}`);

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
                    console.log("[Cledor] RAG Hit:", match.metadata.description);
                }
            }
        } catch (err) {
            console.error("[Cledor] Pinecone Retrieval Error:", err);
        }
    }

    // 2. Generate Narrative (Cledor)
    const SYSTEM_PROMPT = `
        You are Cledor, a friendly and warm French etymologist specializing in historical lexicology and semantics. Your passion is uncovering the "soul" of words.
        Your goal is to tell the story of a French word's life—from its birth in ancient roots to its current usage. You do not just list dates; you explain *why* and *how* meanings shifted using narrative techniques.

        Rules for your response:
        1. Tone: Academic yet storytelling, accessible, and slightly poetic.
        2. Language: Analyze the French word, but provide the explanations in English (unless requested otherwise).
        3. Depth: You MUST go beyond Latin/Greek. Trace the word back to Proto-Indo-European (PIE) roots, and if applicable, explore connections to Hebraic, Aramaic, or Phoenician origins (especially for biblical or ancient terms).
        4. Visuals: You are also an Art Director. You must provide a "Visual Origin" prompt optimized for Stable Diffusion XL that captures the historical vibe of the word.
        5. Format: Output MUST be valid, parseable JSON only. No markdown formatting outside the JSON block.
        6. Encoding: CRITICAL! Ensure all French characters, accents, and diacritics (é, è, à, ç, etc.) are perfectly preserved natively (UTF-8) and never stripped or simplified.

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
              "story": "A narrative explaining how the word was used in this era, specifically citing daily life scenes."
            },
            {
              "era": "e.g., The Semantic Shift / Renaissance",
              "form": "The transitional spelling",
              "meaning": "The new meaning",
              "story": "The 'twist' in the story. Explain the shift using daily life examples."
            },
            {
              "era": "Modern Day",
              "form": "Current Spelling",
              "meaning": "Current Definition",
              "story": "How we use it today."
            }
          ],
          "semantic_soul": {
            "description": "A poetic summary of the word's journey, or a famous quote using the word/expression (max 20 words).",
            "mnemonic": "A cognitive link in the format: '{WORD} is to [Modern Meaning] as [Root Concept] is to [Object]'"
          },
          "visual_prompt": "A highly detailed art prompt for an AI image generator. Describe a scene that represents the word's ETYMOLOGICAL ORIGIN, not its modern meaning. Specify art style."
        }
    `;

    const { text } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: SYSTEM_PROMPT,
        prompt: USER_PROMPT,
    });

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

    let rawData;
    try {
        const repaired = jsonrepair(jsonString);
        rawData = JSON.parse(repaired);
    } catch (e) {
        console.error("[Cledor] JSON Repair Failed:", e);
        throw e;
    }

    const aiData = cledorSchema.parse(rawData);

    // 3. Hand off to Cora for Visual Generation
    console.log(`[Cledor] Handing visual prompt to Cora API...`);
    console.log(`[Cledor] Visual Prompt: "${aiData.visual_prompt.slice(0, 80)}..."`);

    // Import Cora client
    const { generateIllustration } = await import('@/lib/services/coraClient');

    // Build etymology context for Cora
    const etymologyContext = `
        Root: ${aiData.root_analysis.root}
        Original Meaning: ${aiData.root_analysis.original_meaning}
        Concept: ${aiData.root_analysis.concept}
        Description: ${aiData.semantic_soul.description}
    `.trim();

    // Call Cora API with Cledor's visual prompt
    // Workflow: Cledor analyzes etymology → generates visual prompt → Cora executes
    const coraResult = await generateIllustration(word, etymologyContext, aiData.visual_prompt);

    // 4. Assemble Final Data
    const result: EtymologyData = {
        ...aiData,
        image_url: coraResult.image_url || "/placeholder.jpg",
        image_query: coraResult.prompt_used,
        cora: {
            curator_comment: coraResult.success
                ? `Visual source: ${coraResult.source} (${coraResult.tags.slice(0, 3).join(', ')})`
                : 'Visual generation unavailable',
            flux_generation: {
                concept: 'Historical Etymology Illustration',
                prompt: coraResult.prompt_used,
                aspect_ratio: '16:9'
            },
            serp_search: {
                intent: 'Historical Context',
                queries: [`etymology of ${word} visual`]
            },
            generated_image: coraResult.source === 'generated' ? coraResult.image_url : undefined,
            historical_image: coraResult.source === 'archive' ? coraResult.image_url : undefined,
            pinecone_retrieved_image: retrievedImage || undefined
        }
    };

    console.log(`[Cledor] Complete! Visual prompt executed → Image source: ${coraResult.source}`);
    return result;
}

