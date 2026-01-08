import { NextRequest, NextResponse } from "next/server";
import { deepseekModel } from "@/lib/bytez";

/*
 * API Route: /api/chat
 * Uses Bytez SDK with DeepSeek-R1 for AI chat/reasoning
 */

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

        console.log("[API/chat] Processing with DeepSeek-R1...");

        // Send input to DeepSeek-R1 model
        const { error, output } = await deepseekModel.run(messages);

        if (error) {
            console.error("[API/chat] DeepSeek Error:", error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        console.log("[API/chat] Success:", output);

        return NextResponse.json({ output });
    } catch (error: any) {
        console.error("[API/chat] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
