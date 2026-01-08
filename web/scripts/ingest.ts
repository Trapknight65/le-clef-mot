
import { v2 as cloudinary } from 'cloudinary';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'quickstart';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!GROQ_API_KEY || !PINECONE_API_KEY || !OPENAI_API_KEY) {
    console.error("Missing API Keys. Please check .env.local");
    process.exit(1);
}

// Initialize Clients
// Note: Groq SDK uses OpenAI compatible client
const groq = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function analyzeImageWithGroq(imageUrl: string) {
    console.log(`Analyzing ${imageUrl}...`);
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this image for an art history archive. Return a JSON object with: 1. `detailed_description`: A visual description of the scene, people, clothing, and objects. 2. `mood`: The atmosphere. 3. `era_markers`: Specific visual cues indicating the date. 4. `tags`: A list of keywords." },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            temperature: 0.2,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content || "{}");
    } catch (error) {
        console.error("Groq Vision Error:", error);
        return null;
    }
}

async function getEmbedding(text: string) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
            dimensions: 512,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        return null;
    }
}

async function runIngestion() {
    console.log("Starting Ingestion...");

    // 1. Fetch images from Cloudinary (e.g., from a specific folder 'archives')
    // For manual test, you can list resources
    const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'archives/', // Assuming images are in an 'archives' folder
        max_results: 10
    });

    const index = pinecone.index(PINECONE_INDEX);

    for (const resource of resources.resources) {
        const imageUrl = resource.secure_url;
        const publicId = resource.public_id;

        // 2. Analyze Image
        const analysis = await analyzeImageWithGroq(imageUrl);
        if (!analysis) continue;

        // 3. Generate Embedding
        const description = analysis.detailed_description || "";
        const vector = await getEmbedding(description);

        if (!vector) continue;

        // 4. Upsert to Pinecone
        await index.upsert([{
            id: publicId,
            values: vector,
            metadata: {
                url: imageUrl,
                description: description,
                mood: analysis.mood || "",
                era_markers: JSON.stringify(analysis.era_markers || []),
                tags: JSON.stringify(analysis.tags || []),
                type: 'real_archive'
            }
        }]);

        console.log(`Upserted ${publicId}`);
    }

    console.log("Ingestion Complete!");
}

runIngestion();
