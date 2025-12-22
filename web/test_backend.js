require('dotenv').config({ path: '.env.local' });
const SerpApi = require('google-search-results-nodejs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testBackend() {
    console.log("--- STARTING BACKEND TEST ---");

    // 1. Check Env Vars
    console.log("Checking API Keys...");
    if (!process.env.SERPAPI_API_KEY) console.error("❌ SERPAPI_API_KEY missing");
    else console.log("✅ SERPAPI_API_KEY found (" + process.env.SERPAPI_API_KEY.substring(0, 5) + "...)");

    if (!process.env.GOOGLE_API_KEY) console.error("❌ GOOGLE_API_KEY missing");
    else console.log("✅ GOOGLE_API_KEY found (" + process.env.GOOGLE_API_KEY.substring(0, 5) + "...)");

    // 2. Test SerpAPI
    console.log("\n--- Testing SerpAPI ---");
    try {
        const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);
        // We need to wrap it in a promise as the library is callback based
        const result = await new Promise((resolve, reject) => {
            search.json({
                engine: "google_images",
                q: "medieval wool texture",
                num: 1
            }, (data) => {
                if (data.error) reject(data.error);
                else resolve(data);
            });
        });

        if (result.images_results && result.images_results.length > 0) {
            console.log("✅ SerpAPI Success! Image found:", result.images_results[0].original.substring(0, 50) + "...");
        } else {
            console.warn("⚠️ SerpAPI returned no images, but no error.");
        }
    } catch (e) {
        console.error("❌ SerpAPI Failed:", e);
    }

    // 3. Test Gemini 2.0 Flash Lite
    console.log("\n--- Testing Gemini 2.0 Flash Lite ---");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent("Test.");
        console.log(`✅ SUCCESS with gemini-2.0-flash-lite! Response: ${result.response.text()}`);
    } catch (e) {
        console.error(`❌ Failed with gemini-2.0-flash-lite: ${e.status || e.message}`);
    }

    // 4. List Generative AI Models
    console.log("\n--- Listing Models via API ---");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.error("❌ Failed to list models:", data);
        }

    } catch (e) {
        console.error("❌ List Models Failed:", e);
    }
}

testBackend();
