/*
  Test DeepSeek-R1 on Bytez SDK
*/

const Bytez = require("bytez.js");

const key = "3b539bf9f22d66b7c617fc4bb06782fa";
const sdk = new Bytez(key);

async function testDeepSeek() {
    console.log("Testing DeepSeek-R1...");

    const model = sdk.model("deepseek-ai/DeepSeek-R1");

    const result = await model.run([
        { role: "user", content: "Say hello in one word" }
    ]);

    console.log("Full result:", JSON.stringify(result, null, 2));
}

testDeepSeek().catch(console.error);
