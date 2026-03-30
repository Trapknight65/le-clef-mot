#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════
 *  LE CLEF MOT — Pipeline Simulation Script
 *  Fires a batch of French words through the live /api/search
 *  endpoint and captures structured results with metrics.
 * ═══════════════════════════════════════════════════════════
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ━━━ Configuration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const WORDS = [
    'Lumière',
    'Silence',
    'Liberté',
    'Travail',
    'Amour',
];

const OUTPUT_PATH = resolve(__dirname, 'simulation_results.json');

// ━━━ Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function log(icon, msg) {
    const ts = new Date().toISOString().split('T')[1].slice(0, 8);
    console.log(`  ${icon}  [${ts}] ${msg}`);
}

async function analyzeWord(word) {
    const start = Date.now();
    try {
        const res = await fetch(`${API_BASE}/api/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word }),
            signal: AbortSignal.timeout(60000), // 60s timeout per word
        });

        const latency = Date.now() - start;

        if (!res.ok) {
            const errBody = await res.text();
            return {
                word,
                status: 'error',
                latency_ms: latency,
                data: null,
                error: `HTTP ${res.status}: ${errBody.slice(0, 200)}`,
            };
        }

        const data = await res.json();
        return {
            word,
            status: 'success',
            latency_ms: latency,
            data,
            error: null,
        };
    } catch (err) {
        return {
            word,
            status: 'error',
            latency_ms: Date.now() - start,
            data: null,
            error: err.message,
        };
    }
}

// ━━━ Main ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function main() {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║   LE CLEF MOT — Pipeline Simulation     ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
    log('🎯', `Target: ${API_BASE}/api/search`);
    log('📋', `Words: ${WORDS.join(', ')}`);
    console.log('  ─────────────────────────────────────────────');

    const results = [];
    let successCount = 0;
    let totalLatency = 0;

    for (let i = 0; i < WORDS.length; i++) {
        const word = WORDS[i];
        log('⚡', `[${i + 1}/${WORDS.length}] Analyzing "${word}"...`);

        const result = await analyzeWord(word);
        results.push(result);
        totalLatency += result.latency_ms;

        if (result.status === 'success') {
            successCount++;
            const root = result.data?.root_analysis?.root || '—';
            const concept = result.data?.root_analysis?.concept || '—';
            log('✅', `"${word}" → Root: ${root} | Concept: ${concept} | ${result.latency_ms}ms`);
        } else {
            log('❌', `"${word}" → FAILED: ${result.error} | ${result.latency_ms}ms`);
        }
    }

    // ━━━ Build Output ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const output = {
        meta: {
            timestamp: new Date().toISOString(),
            api_base: API_BASE,
            total_words: WORDS.length,
            successful: successCount,
            failed: WORDS.length - successCount,
            success_rate: `${Math.round((successCount / WORDS.length) * 100)}%`,
            avg_latency_ms: Math.round(totalLatency / WORDS.length),
            total_duration_ms: totalLatency,
        },
        results,
    };

    // ━━━ Write Results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

    console.log('');
    console.log('  ━━━━━━━━━━━━━━ SIMULATION COMPLETE ━━━━━━━━━━━━━━');
    console.log(`  ✅ Successful:   ${successCount}/${WORDS.length}`);
    console.log(`  ❌ Failed:       ${WORDS.length - successCount}/${WORDS.length}`);
    console.log(`  ⏱️  Avg Latency:  ${output.meta.avg_latency_ms}ms`);
    console.log(`  📄 Results:      ${OUTPUT_PATH}`);
    console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
