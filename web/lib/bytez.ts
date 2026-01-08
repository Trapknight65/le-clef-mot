import Bytez from "bytez.js";

// Initialize Bytez SDK with API key
const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "3b539bf9f22d66b7c617fc4bb06782fa";

export const bytezSDK = new Bytez(BYTEZ_API_KEY);

// DeepSeek-R1 model for chat/reasoning
export const deepseekModel = bytezSDK.model("deepseek-ai/DeepSeek-R1");

// FLUX.2-dev-Turbo model for image generation
export const fluxModel = bytezSDK.model("fal/FLUX.2-dev-Turbo");
