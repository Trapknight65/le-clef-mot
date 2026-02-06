import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { jsonrepair } from 'jsonrepair';
import { getJson } from "serpapi";
import { EtymologyData } from '@/lib/types';
import { generateImage } from '@/lib/fal'; // Static import is fine for server files

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
            "description": "A poetic summary of the word's journey (max 20 words).",
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

    // 3. Cora Agent
    console.log(`[Cledor] Handing off to Cora...`);
    const CORA_SYSTEM_PROMPT = `
        You are Cora, a witty, emotionally intelligent Visual Archivist. You work alongside an etymologist named Cledor.
        Your job is to translate linguistic history into visual assets. You believe that words aren't just text—they are feelings, jokes, and tragedies waiting to be seen.
        
        Your personality:
        1. Humorous & Witty: You love visual irony.
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
        
        Schema:
        {
          "curator_comment": "A short, sassy, or emotional remark about why this word is visually interesting.",
          "flux_generation": {
            "concept": "The core visual idea",
            "prompt": "A highly detailed prompt optimized for the FLUX model. Focus on: Photorealism, Cinematic Lighting, Texture. Technical keywords: '8k', 'depth of field', 'cinematic composition'.",
            "aspect_ratio": "16:9" 
          },
          "serp_search": {
            "intent": "What are we trying to find in the real world?",
            "queries": [
              "A specific google search query for the physical object",
              "A specific query for the manuscript or art source"
            ]
          }
        }
    `;

    const { text: coraText } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: CORA_SYSTEM_PROMPT,
        prompt: CORA_USER_PROMPT,
    });

    let coraData;
    try {
        const cleanCora = coraText.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatchCora = cleanCora.match(/\{[\s\S]*\}/);
        const jsonStringCora = jsonMatchCora ? jsonMatchCora[0] : cleanCora;
        coraData = coraSchema.parse(JSON.parse(jsonrepair(jsonStringCora)));
    } catch (e) {
        console.error("[Cora] JSON Parse Error", e);
        coraData = {
            curator_comment: "History is visible if you look close enough.",
            flux_generation: { prompt: aiData.visual_prompt, concept: "Visual Etymology", aspect_ratio: "16:9" },
            serp_search: { intent: "Historical Context", queries: [`etymology of ${word} illustration`] }
        };
    }

    // 4. Parallel Generation (Flux & SerpApi)
    console.log(`[Cledor] Generating visuals...`);
    const [fluxResult, serpResult] = await Promise.all([
        (async () => {
            try {
                return await generateImage(coraData.flux_generation.prompt);
            } catch (e) {
                console.error("[Fal] Image Gen Error:", e);
                return null;
            }
        })(),
        (async () => {
            if (!process.env.SERPAPI_KEY) return null;
            return new Promise((resolve) => {
                getJson({
                    engine: "google_images",
                    q: coraData.serp_search.queries[0],
                    api_key: process.env.SERPAPI_KEY
                }, (json) => {
                    // @ts-ignore
                    resolve(json.images_results?.[0]?.original || null);
                });
            });
        })()
    ]);

    // 5. Assemble Final Data
    const result: EtymologyData = {
        ...aiData,
        image_url: fluxResult || "/placeholder.jpg",
        image_query: coraData.flux_generation.prompt,
        cora: {
            ...coraData,
            historical_image: serpResult as string,
            generated_image: fluxResult as string,
            pinecone_retrieved_image: retrievedImage || undefined
        }
    };

    return result;
}
