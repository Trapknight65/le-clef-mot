require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    console.log("Listing available models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.error("Available Models (STDERR):");
            // data.models.filter(m => m.name.includes("flash")).forEach(m => console.error(m.name));
            data.models.forEach(m => console.error(m.name));
        } else {
            console.error("❌ Failed to list models:", data);
        }
    } catch (e) {
        console.error("❌ Error:", e);
    }
}

listModels();
