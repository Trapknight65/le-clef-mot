/*
* Flowise Custom Tool: The Studio
* Description: Generates multiple video clips in parallel using Google Vertex AI (Veo).
* Input: 'prompts' (string) - A stringified JSON object containing an array of scenes. 
*        Example: '{"scenes": [{"prompt": "Start of prompt..."}, {"prompt": "End of prompt..."}]}'
* Output: JSON string array of video URIs.
*/

const fetch = require('node-fetch'); // Flowise environment usually supplies this or axios

/* 
 * You will need to set these environment variables in Flowise:
 * GOOGLE_CLOUD_PROJECT_ID
 * GOOGLE_CLOUD_LOCATION (e.g., us-central1)
 * GOOGLE_ACCESS_TOKEN (For prototype; in prod use built-in Google Auth credential instructions)
 */

const execute = async (prompts, options) => {
    try {
        console.log("Studio Tool: Received input string.");
        
        // 1. Safe Parse Input
        let scenesData;
        try {
            // Clean specific markdown code blocks if the LLM includes them unintentionally
            const cleanedInput = prompts.replace(/```json/g, '').replace(/```/g, '').trim();
            scenesData = JSON.parse(cleanedInput);
        } catch (e) {
            return JSON.stringify({ error: "Failed to parse JSON input. Ensure 'The Video Director' outputs strict JSON.", details: e.message });
        }

        const scenes = scenesData.scenes || [];
        if (scenes.length === 0) {
            return JSON.stringify({ error: "No scenes found in the input JSON." });
        }

        console.log(`Studio Tool: Processing ${scenes.length} scenes in parallel.`);

        // 2. Define the Generation Function
        const generateClip = async (scene, index) => {
            const endpoint = `https://${process.env.GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.GOOGLE_CLOUD_LOCATION}/publishers/google/models/veo-001:predict`;
            
            const payload = {
                instances: [
                    {
                        prompt: scene.prompt,
                        // Defaults for consistent style
                        aspectRatio: "9:16", 
                        durationSeconds: 6, // Veo often defaults to short clips
                    }
                ],
                parameters: {
                    sampleCount: 1
                }
            };

            try {
                // NOTE: specific auth implementation depends on Flowise's Google Auth integration.
                // Assuming bearer token is available via process.env or options for this prototype.
                // In a real Flowise node, you'd use the Credential functionality.
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`, // Placeholder for auth
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`API Error ${response.status}: ${errText}`);
                }

                const result = await response.json();
                // Extract video URI from response structure (structure depends on exact Gemini/Veo model version)
                // This is a generalized path for Vertex AI prediction responses.
                const videoUri = result.predictions?.[0]?.videoUri || result.predictions?.[0] || "Error: No URI returned";
                
                return {
                    scene_index: index,
                    prompt: scene.prompt,
                    video_uri: videoUri,
                    status: "success"
                };

            } catch (error) {
                console.error(`Error generating scene ${index}:`, error);
                return {
                    scene_index: index,
                    status: "error",
                    error: error.message
                };
            }
        };

        // 3. Execute Parallel Requests (Fan-Out)
        // We use Promise.all to fire them all at once.
        const videoPromises = scenes.map((scene, index) => generateClip(scene, index));
        const results = await Promise.all(videoPromises);

        // 4. Return Agreggated Results
        return JSON.stringify(results, null, 2);

    } catch (globalError) {
        return JSON.stringify({ error: "Critical Tool Failure", details: globalError.message });
    }
};

// Export the function as 'code' for Flowise Custom JS Tool
module.exports = { execute };
