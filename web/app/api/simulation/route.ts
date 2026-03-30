import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export async function GET() {
    try {
        const filePath = resolve(process.cwd(), 'scripts', 'simulation_results.json');

        if (!existsSync(filePath)) {
            return NextResponse.json(
                {
                    meta: {
                        timestamp: null,
                        total_words: 0,
                        successful: 0,
                        failed: 0,
                        success_rate: '0%',
                        avg_latency_ms: 0,
                        total_duration_ms: 0,
                    },
                    results: [],
                    error: 'No simulation results found. Run the simulation script first.',
                },
                { status: 200 }
            );
        }

        const raw = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
