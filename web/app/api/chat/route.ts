import { NextRequest, NextResponse } from "next/server";
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { streamText } from 'ai';

/*
 * API Route: /api/chat
 * Uses Groq (Llama 3.3) for AI chat/reasoning (Migrated from Bytez)
 */

const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Messages array is required" },
                { status: 400 }
            );
        }

        console.log("[API/chat] Processing with Groq (Llama 3.3)...");

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("[API/chat] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
