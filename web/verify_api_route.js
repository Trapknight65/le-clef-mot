
async function testApi() {
    try {
        console.log("Testing /api/search...");
        const response = await fetch("http://localhost:3000/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: "canape" })
        });

        const data = await response.json();
        if (data.story && data.story.includes("[MOCK]")) {
            console.error("❌ FAILURE: API returned Mock Data!");
            console.error("Story:", data.story);
        } else {
            console.log("✅ SUCCESS: API returned Real Data!");
            console.log("Root Concept:", data.root_concept);
        }
    } catch (e) {
        console.error("Error calling API:", e);
    }
}

testApi();
