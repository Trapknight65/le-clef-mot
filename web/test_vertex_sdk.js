
require('dotenv').config({ path: '.env.local' });
const { VertexAI } = require('@google-cloud/vertexai');

async function testVertex() {
    console.log("--- Testing configured Vertex AI SDK ---");
    console.log(`Project: ${process.env.GOOGLE_PROJECT_ID}`);
    console.log(`Location: ${process.env.GOOGLE_LOCATION}`);
    console.log(`Key File: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

    try {
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_PROJECT_ID,
            location: process.env.GOOGLE_LOCATION,
        });

        const model = vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash-001',
        });

        const request = {
            contents: [{ role: 'user', parts: [{ text: 'Explain the etymology of the word "vertex" briefly.' }] }],
        };

        const result = await model.generateContent(request);
        const response = await result.response;

        console.log("✅ SUCCESS: Vertex AI Response Received:");
        console.log(response.candidates[0].content.parts[0].text);

    } catch (e) {
        console.error("❌ Vertex AI Error:", e);
    }
}

testVertex();
