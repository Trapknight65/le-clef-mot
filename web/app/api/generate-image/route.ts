import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/fal";

/*
 * API Route: /api/generate-image
 * Uses Bytez with FLUX.2-dev-Turbo (with SDXL/SD 1.5 fallbacks) for image generation
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

        console.log("[API/generate-image] Generating with Bytez (Flux):", prompt);

        // Send prompt to Fal
        const imageUrl = await generateImage(prompt);

        if (!imageUrl) {
            console.error("[API/generate-image] Fal Error: No image returned");
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }

        console.log("[API/generate-image] Success:", imageUrl);

        return NextResponse.json({ output: imageUrl });
    } catch (error: any) {
        console.error("[API/generate-image] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

