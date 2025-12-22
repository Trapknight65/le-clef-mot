/*
* Test Script for Studio Tool Logic
* Usage: node test_studio_logic.js
*/

// Mock the 'node-fetch' module
const mockFetch = async (url, options) => {
    // Simulate API Latency (random between 100ms and 500ms)
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));

    // Check if URL looks right
    if (!url.includes('predict')) {
        return { ok: false, status: 404, text: async () => "Not Found" };
    }

    const body = JSON.parse(options.body);
    const scenePrompt = body.instances[0].prompt;

    console.log(`[MOCK API] Processing prompt: "${scenePrompt.substring(0, 30)}..."`);

    // Return success mock response
    return {
        ok: true,
        json: async () => ({
            predictions: [
                {
                    videoUri: `gs://bucket/video_${Math.floor(Math.random() * 1000)}.mp4`
                }
            ]
        })
    };
};

// Override require to return our mock for 'node-fetch'
// Note: This is a hacky way to test a module that requires 'node-fetch' without actually installing it in this temp environment
// Since we wrote studio_tool.js to require 'node-fetch', we need to load it slightly differently for this test or just copy-paste the logic.
// Simpler approach for this environment: We will read the studio_tool.js content, prepend the mock, and eval it or just rewrite the Logic class here to test.
// ACTUALLY, to be cleaner, let's just copy the 'execute' logic here and inject the mock fetch.

const executeLogic = async (prompts) => {
    console.log("--- Starting Test Execution ---");

    // --- PASTE OF LOGIC FROM studio_tool.js (Modified to use local mockFetch) ---
    // In a real scenario we'd use dependency injection or a solidified test runner.

    try {
        let scenesData;
        try {
            const cleanedInput = prompts.replace(/```json/g, '').replace(/```/g, '').trim();
            scenesData = JSON.parse(cleanedInput);
        } catch (e) {
            return JSON.stringify({ error: "Failed to parse JSON input.", details: e.message });
        }

        const scenes = scenesData.scenes || [];
        if (scenes.length === 0) return JSON.stringify({ error: "No scenes found." });

        const generateClip = async (scene, index) => {
            // Using mockFetch instead of real fetch
            try {
                const response = await mockFetch("https://mock-vertex-api/predict", {
                    method: 'POST',
                    body: JSON.stringify({ instances: [{ prompt: scene.prompt }] })
                });

                if (!response.ok) throw new Error("API Error");

                const result = await response.json();
                const videoUri = result.predictions?.[0]?.videoUri || "Error";

                return { scene_index: index, video_uri: videoUri, status: "success" };

            } catch (error) {
                return { scene_index: index, status: "error", error: error.message };
            }
        };

        const results = await Promise.all(scenes.map((s, i) => generateClip(s, i)));
        return JSON.stringify(results, null, 2);

    } catch (globalError) {
        return JSON.stringify({ error: "Critical Failure", details: globalError.message });
    }
    // --- END OF LOGIC ---
};

// Test Cases
const runTests = async () => {
    // Case 1: Valid Input
    const validInput = JSON.stringify({
        scenes: [
            { prompt: "Scene 1: A medieval monk" },
            { prompt: "Scene 2: Woolen texture details" },
            { prompt: "Scene 3: Spinning wheel" }
        ]
    });

    console.log("\nTest 1: Valid Input");
    const result1 = await executeLogic(validInput);
    console.log("Result:", result1);

    // Case 2: Invalid JSON
    console.log("\nTest 2: Invalid JSON");
    const result2 = await executeLogic("{ bad json: [");
    console.log("Result:", result2);

    // Case 3: Markdown Fenced JSON (LLM common output)
    console.log("\nTest 3: Markdown Clean-up");
    const markdownInput = "```json\n" + validInput + "\n```";
    const result3 = await executeLogic(markdownInput);
    console.log("Result:", result3);
};

runTests();
