require('dotenv').config({ path: '.env.local' });

async function testVertex() {
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = process.env.GOOGLE_LOCATION;
    const apiKey = process.env.GOOGLE_API_KEY;
    const modelId = "gemini-1.5-flash-001"; // Vertex version naming

    console.log(`Testing Vertex AI...`);
    console.log(`Project: ${projectId}, Location: ${location}`);

    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: "Hello, explain the etymology of the word 'Vertex'." }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`❌ HTTP Error: ${response.status}`);
            console.error(errText);
            return;
        }

        const data = await response.json();
        console.log("✅ API Response Received:");

        if (data.candidates && data.candidates[0].content) {
            console.log(data.candidates[0].content.parts[0].text);
        } else {
            console.log("Full Response:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("❌ Exception:", e);
    }
}

testVertex();
