import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';


/* 
 * API Route: /api/search
 * Handles the "Semantic Pivot" logic and data retrieval using Groq (Llama 3.3).
 * Generates visuals using Fal.ai (Flux).
 */

// Define the schema for reference/validation (optional usage here)
const searchSchema = z.object({
    breakdown: z.array(z.object({
        part: z.string(),
        meaning: z.string(),
        color: z.enum(['red', 'blue', 'green', 'yellow']).optional()
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

// Create Groq client
const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a 'Visual Etymologist'. Do not write paragraphs.
Analyze the word and output JSON.

IMPORTANT: 
[
    {
        "StartLine": 44,
        "EndLine": 46,
        "TargetContent": "1. Ensure all arrays have commas between elements.\n2. ESCAPE ALL DOUBLE QUOTES inside strings (e.g., \"The \\\"Word\\\"\" not \"The \"Word\"\").\n3. Output ONLY the JSON object.",
        "ReplacementContent": "Focus on creating a rich, visual, and educational breakdown of the word.",
        "AllowMultiple": false
    },
    {
        "StartLine": 67,
        "EndLine": 67,
        "TargetContent": "Analyze the word and output JSON:",
        "ReplacementContent": "Analyze the word:",
        "AllowMultiple": false
    }
]

Format:
{
  "breakdown": [
    { "part": "Co", "meaning": "With", "color": "red" },
    { "part": "Pain", "meaning": "Bread", "color": "blue" }
  ],
  "literal_meaning": "With Bread",
  "mnemonic": "Someone you break bread with.",
  "visual_contrast_prompt": "Close up of a medieval monk writing on a table covered by a thick layout cloth.",
  "video_prompt": "Slow pan, cinematic lighting, dust particles floating, the monk is writing smoothly.",
  "story": "Three sentences narrative.",
  "root": "Compain",
  "root_concept": "Bread Sharer",
  "scenes": [
     {"scene_index": 0, "prompt": "Scene description..."},
     {"scene_index": 1, "prompt": "Scene description..."}
  ]
}

Analyze the word:
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        console.log(`[API] Processing search for: ${word}`);

        // 1. Generate Content via Groq
        let aiData: any;
        if (process.env.GROQ_API_KEY) {
            try {
                const { object } = await generateObject({
                    model: groq('llama-3.3-70b-versatile'),
                    system: SYSTEM_PROMPT,
                    prompt: `Analyze the visual etymology of: "${word}"`,
                    schema: searchSchema,
                    temperature: 0.5,
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

        // 2. Generate Image via Fal.ai (Flux Schnell)
        let imageUrl = "/placeholder_history.jpg";
        const imagePrompt = `Historical illustration, ${aiData.visual_contrast_prompt || aiData.root_concept}, engraving style, detailed`;

        if (process.env.FAL_KEY) {
            try {
                console.log("Generating image with Fal.ai...");
                const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
                    method: "POST",
                    headers: {
                        "Authorization": `Key ${process.env.FAL_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: imagePrompt,
                        image_size: "landscape_4_3",
                        num_inference_steps: 4,
                        enable_safety_checker: true
                    })
                });

                if (falResponse.ok) {
                    const falData = await falResponse.json();
                    if (falData.images && falData.images.length > 0) {
                        imageUrl = falData.images[0].url;
                    }
                } else {
                    console.error("Fal.ai Error:", await falResponse.text());
                }
            } catch (e) {
                console.error("Fal.ai Exception:", e);
            }
        }

        // 3. Assemble Response
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
            image_query: imagePrompt,
            image_url: imageUrl,
            scenes: (aiData.scenes || []).map((s: any) => ({
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
        breakdown: [{ part: word.substring(0, 3), meaning: "First part", color: "red" }, { part: word.substring(3), meaning: "Second part", color: "blue" }],
        literal_meaning: "Mock Translation",
        mnemonic: "Mock Mnemonic: This is a placeholder.",
        visual_contrast_prompt: `Historical ${word} object`,
        story: `[MOCK] The word '${word}' history placeholder. (Error: ${errorReason})`,
        root: "Ancient Root",
        root_concept: "Historical Object",
        scenes: Array(6).fill(null).map((_, i) => ({ scene_index: i, prompt: `Scene ${i}` }))
    };
}
