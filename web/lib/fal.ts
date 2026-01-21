import { fal } from "@fal-ai/client";

// Initialize Fal client with credentials
fal.config({
    credentials: process.env.FAL_KEY,
});

export async function generateImage(prompt: string): Promise<string | null> {
    console.log(`[Fal] Generating image for: "${prompt.substring(0, 30)}..."`);

    try {
        const { data } = await fal.subscribe("fal-ai/flux/dev", {
            input: {
                prompt: prompt,
                image_size: "landscape_16_9",
                num_inference_steps: 28,
                guidance_scale: 3.5,
                enable_safety_checker: true
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });

        if (data && data.images && data.images.length > 0) {
            return data.images[0].url;
        }

    } catch (error: any) {
        console.error("Fal.ai Generation Error:", error);
    }

    return null;
}
