import { NextRequest, NextResponse } from "next/server";
import { fluxModel } from "@/lib/bytez";

/*
 * API Route: /api/generate-image
 * Uses Bytez SDK with FLUX.2-dev-Turbo for image generation
 */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        console.log("[API/generate-image] Generating with FLUX.2-dev-Turbo:", prompt);

        // Send prompt to FLUX.2-dev-Turbo model
        const { error, output } = await fluxModel.run(prompt);

        if (error) {
            console.error("[API/generate-image] FLUX Error:", error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        console.log("[API/generate-image] Success:", output);

        return NextResponse.json({ output });
    } catch (error: any) {
        console.error("[API/generate-image] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
