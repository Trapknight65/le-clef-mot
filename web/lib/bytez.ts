import Bytez from "bytez.js";

// Initialize Bytez SDK with API key
const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "3b539bf9f22d66b7c617fc4bb06782fa";

export const bytezSDK = new Bytez(BYTEZ_API_KEY);

// Define Models (Exported for direct access if needed)
export const fluxModel = bytezSDK.model("fal/FLUX.2-dev-Turbo");
export const deepseekModel = bytezSDK.model("deepseek-ai/DeepSeek-R1");
export const sdxlModel = bytezSDK.model("stabilityai/stable-diffusion-xl-base-1.0");
export const sd15Model = bytezSDK.model("runwayml/stable-diffusion-v1-5");

const models = {
    primary: fluxModel,
    secondary: sdxlModel,
    tertiary: sd15Model,
};

/**
 * Robust Image Generation with Fallbacks
 * Tries models in order: Flux -> SDXL -> SD 1.5
 */
export async function generateImage(prompt: string): Promise<string | null> {
    console.log(`[Bytez] Generating image for: "${prompt.substring(0, 30)}..."`);

    // 1. Try Primary (Flux)
    try {
        console.log("...Attempting FLUX.2-dev-Turbo");
        const { error, output } = await models.primary.run(prompt);

        if (!error && output) {
            const url = parseOutput(output);
            if (url) return url;
        }
        if (error) console.warn("Flux failed:", error);
    } catch (e) {
        console.warn("Flux Exception:", e);
    }

    // 2. Try Secondary (SDXL)
    try {
        console.log("...Fallback to SDXL");
        const { error, output } = await models.secondary.run(prompt);

        if (!error && output) {
            const url = parseOutput(output);
            if (url) return url;
        }
        if (error) console.warn("SDXL failed:", error);
    } catch (e) {
        console.warn("SDXL Exception:", e);
    }

    // 3. Try Tertiary (SD 1.5 - Fast/Reliable)
    try {
        console.log("...Fallback to SD 1.5");
        const { error, output } = await models.tertiary.run(prompt);

        if (!error && output) {
            const url = parseOutput(output);
            if (url) return url;
        }
        if (error) console.warn("SD 1.5 failed:", error);
    } catch (e) {
        console.error("All Image Generation Failed:", e);
    }

    return null;
}

// Helper to handle mixed output types from Bytez
function parseOutput(output: any): string | null {
    if (typeof output === 'string' && output.startsWith('http')) return output;
    if (output?.url) return output.url;
    if (Array.isArray(output) && output[0]?.url) return output[0].url;
    // Some models return base64
    if (output?.base64) return `data:image/png;base64,${output.base64}`;

    return null;
}
