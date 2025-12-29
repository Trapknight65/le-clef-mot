import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const SerpApi = require('google-search-results-nodejs');

/* 
 * API Route: /api/search
 * Handles the "Semantic Pivot" logic and data retrieval using Groq (Mixtral).
 */

// Define the schema for the output
const searchSchema = z.object({
    story: z.string().describe("Short 3-sentence narrative connecting modern word to root object."),
    root: z.string().describe("The root object name"),
    root_concept: z.string().describe("The concept (e.g. 'Examples: Coarse Wool, Mosquito Net')"),
    visual_subject: z.string().describe("Precise description for an image search of the historical object"),
    image_query: z.string().describe("Search query for archives, engravings or illustration of semantic pivot"),
    scenes: z.array(z.object({
        scene_index: z.number(),
        prompt: z.string().describe("Visual description of scene")
    }))
});

// Create Groq client
const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are 'The Etymologist' & 'The Archivist'.
For the given word, find its HISTORICAL ROOT OBJECT (The Semantic Pivot).
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        console.log(`[API] Processing search for: ${word}`);

        // 1. Generate Content (Story & Pivot) via Groq
        let aiData;
        if (process.env.GROQ_API_KEY) {
            try {
                const { object } = await generateObject({
                    model: groq('mixtral-8x7b-32768'),
                    system: SYSTEM_PROMPT,
                    prompt: `Analyze the etymology of: "${word}"`,
                    schema: searchSchema,
                });
                aiData = object;
            } catch (e: any) {
                console.error("Groq API Error:", e);
                console.log("Falling back to Mock Data due to API Error.");
                aiData = getMockData(word, e.message);
            }
        } else {
            console.log("No GROQ_API_KEY found. Using mock data.");
            aiData = getMockData(word, "Missing GROQ_API_KEY");
        }

        // 2. Fetch Real Image via SerpAPI (Unchanged)
        let imageUrl = "/placeholder_history.jpg";
        if (process.env.SERPAPI_API_KEY && aiData.image_query) {
            try {
                const imageData: any = await new Promise((resolve, reject) => {
                    const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);
                    search.json({
                        engine: "google_images",
                        q: aiData.image_query,
                        num: 1
                    }, (json: any) => {
                        if (json.error) reject(json.error);
                        else resolve(json);
                    });
                });

                if (imageData.images_results && imageData.images_results.length > 0) {
                    imageUrl = imageData.images_results[0].original;
                }
            } catch (e) {
                console.error("SerpAPI Error:", e);
            }
        }

        // 3. Assemble Response
        const responseData = {
            word: word,
            root: aiData.root,
            root_concept: aiData.root_concept,
            story: aiData.story,
            visual_subject: aiData.visual_subject,
            image_query: aiData.image_query,
            image_url: imageUrl,
            scenes: aiData.scenes.map((s: any) => ({
                ...s,
                video_uri: ""
            }))
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error("Global API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getMockData(word: string, errorReason: string = "") {
    return {
        story: `[MOCK] The word '${word}' comes from an ancient root. (Error: ${errorReason}) (Configure GROQ_API_KEY for real history).`,
        root: "Ancient Root",
        root_concept: "Historical Object",
        visual_subject: "A generic historical artifact",
        image_query: `authentic historical ${word} artifact museum`,
        scenes: Array(6).fill(null).map((_, i) => ({ scene_index: i, prompt: `Scene ${i}` }))
    };
}
