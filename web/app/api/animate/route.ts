import { NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, image_url, word } = body; // Read word for path

        if (!prompt || !image_url) {
            return NextResponse.json({ error: "Missing prompt or image_url" }, { status: 400 });
        }

        console.log("[API/Animate] Starting generation...", { prompt });

        // Use FAL_KEY from env
        fal.config({
            credentials: process.env.FAL_KEY,
        });

        // Minimax Video Generation
        const result: any = await fal.subscribe("fal-ai/minimax/video-01/image-to-video", {
            input: {
                prompt: prompt,
                image_url: image_url,
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    // console.log(update);
                }
            },
        });

        if (result && result.video) {
            return NextResponse.json({ video_url: result.video.url });
        } else {
            return NextResponse.json({ error: "No video returned" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[API/Animate] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
