import { NextResponse } from 'next/server';
import { generateEtymology } from '@/lib/cledor';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { word } = body;

        if (!word) {
            return NextResponse.json({ error: "Word is required" }, { status: 400 });
        }

        const data = await generateEtymology(word);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
