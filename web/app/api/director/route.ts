import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { jsonrepair } from 'jsonrepair';

// Clients
const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

/*
 * API Route: /api/director
 * "David" Persona.
 * Input: Cledor (Etymology) + Cora (Visuals)
 * Output: Video Script JSON
 */

const timelineSchema = z.object({
    video_meta: z.object({
        title: z.string(),
        total_duration: z.number(),
        bg_music_mood: z.string()
    }),
    timeline: z.array(z.object({
        scene_id: z.number(),
        duration: z.number(),
        visual_source: z.enum(["Flux-Generated", "Stock-Video", "Text-Only", "Selfie-Mode-Avatar", "Text-Motion"]),
        visual_description: z.string(),
        overlay_text: z.string(),
        voiceover_script: z.string(),
        transition: z.string()
    }))
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { word, cledor, cora } = body;

        console.log(`[Director] Action! Creating script for: ${word}`);

        // (Removed previous unused prompts)

        // 0. David (Director) - Now using Bytez via LangChain
        const { BytezChatModel } = await import("@/lib/langchain-bytez");
        const llm = new BytezChatModel({ modelId: "meta-llama/Meta-Llama-3-70B-Instruct" });

        const SYSTEM_PROMPT = `
        You are David, the Director of 'Le Mot Clef'. You are an expert in short-form video storytelling (TikTok/Reels/Shorts).

        Your Goal:
        Create a highly engaging, 95-second educational video script (1:35 min) about the etymology of a word.

        Your Style:
        1. Pacing: Fast, rhythmic, and visual.
        2. Structure: You split the video into exactly 12 scenes (approx 8 seconds each).
        3. Tone: "Edutainment" — You mix the academic depth of Cledor with the visual sass of Cora.
        4. Output: Strict JSON format that describes the timeline, voiceover, overlays, and visual movement.

        The "David" Formula:
        - Scene 1: The Hook (Stop the scroll).
        - Scenes 2-5: The Ancient Origin (The visual root).
        - Scenes 6-9: The Twist (How the meaning changed).
        - Scenes 10-11: The Modern Connection.
        - Scene 12: The Mnemonic & Outro.
        `;

        const USER_PROMPT = `
        Input Data:
        Word: "${word}"
        Cledor's Analysis: ${JSON.stringify(cledor)}
        Cora's Visuals: ${JSON.stringify(cora)}

        Act as David. Generate the JSON Timeline for a 9:16 vertical video.
        
        RETURN ONLY JSON. No markdown.
        `;

        const response = await llm.invoke([
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT }
        ]);

        const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

        // Parse
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

        let scriptData;
        try {
            const repaired = jsonrepair(jsonString);
            scriptData = JSON.parse(repaired);
        } catch (e) {
            console.error("Director JSON Repair Failed:", e);
            throw e;
        }

        return NextResponse.json(scriptData);

    } catch (error: any) {
        console.error("Director API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
