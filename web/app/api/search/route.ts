import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const SerpApi = require('google-search-results-nodejs');

/* 
 * API Route: /api/search
 * Handles the "Semantic Pivot" logic and data retrieval.
 */

const SYSTEM_PROMPT = `
You are 'The Etymologist' & 'The Archivist'.
For the given word, find its HISTORICAL ROOT OBJECT (The Semantic Pivot).
Output JSON ONLY.

Format:
{
  "story": "Short 3-sentence narrative connecting modern word to root object.",
  "root": "The root object name",
  "root_concept": "The concept (e.g. 'Examples: Coarse Wool, Mosquito Net')",
  "visual_subject": "Precise description for an image search of the historical object",
  "image_query": "Search query for archives, engravings or illustration of semantic pivot",
  "scenes": [
     {"scene_index": 0, "prompt": "Visual description of scene 1..."},
     {"scene_index": 1, "prompt": "Visual description of scene 2..."},
     {"scene_index": 2, "prompt": "Visual description of scene 3..."},
     {"scene_index": 3, "prompt": "Visual description of scene 4..."},
     {"scene_index": 4, "prompt": "Visual description of scene 5..."},
     {"scene_index": 5, "prompt": "Visual description of scene 6..."}
  ]
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        console.log(`[API] Processing search for: ${word}`);

        // 1. Generate Content (Story & Pivot) via Gemini
        // If no key provided, fallback to mock to prevent app crash
        let aiData;
        if (process.env.GOOGLE_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
                // Updated to match available models for this key (Gemini 2.0 / 2.5)
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: `Analyze the etymology of: "${word}"\n${SYSTEM_PROMPT}` }] }],
                    generationConfig: { responseMimeType: "application/json" }
                });

                aiData = JSON.parse(result.response.text());
            } catch (e: any) {
                console.error("Gemini API Error:", e);
                // Fallback if API fails (429, 404, etc.)
                console.log("Falling back to Mock Data due to API Error.");
                aiData = getMockData(word);
            }
        } else {
            console.log("No GOOGLE_API_KEY found. Using mock data.");
            aiData = getMockData(word);
        }

        // 2. Fetch Real Image via SerpAPI
        let imageUrl = "/placeholder_history.jpg";
        if (process.env.SERPAPI_API_KEY && aiData.image_query) {
            try {
                // Wrap callback-based SerpAPI in Promise
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
            image_url: imageUrl, // New Field
            scenes: aiData.scenes.map((s: any) => ({
                ...s,
                video_uri: "" // Placeholder, as we don't have real Veo connected yet
            }))
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error("Global API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getMockData(word: string) {
    return {
        story: `[MOCK] The word '${word}' comes from an ancient root. (Configure GOOGLE_API_KEY for real history).`,
        root: "Ancient Root",
        root_concept: "Historical Object",
        visual_subject: "A generic historical artifact",
        image_query: `authentic historical ${word} artifact museum`,
        scenes: Array(6).fill(null).map((_, i) => ({ scene_index: i, prompt: `Scene ${i}` }))
    };
}
