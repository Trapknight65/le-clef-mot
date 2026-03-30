/**
 * Cora API Client
 * 
 * Service for communicating with the Python-based Cora visual generation API.
 * Provides historical illustration generation with intelligent fallback to museum archives.
 */

const CORA_API_URL = process.env.CORA_API_URL || 'http://localhost:8000';

export interface CoraIllustrationRequest {
    word: string;
    etymology_context?: string;
    visual_prompt?: string;  // Cledor's pre-made visual prompt
    style?: string;
}

export interface CoraIllustrationResponse {
    success: boolean;
    image_url?: string;
    image_base64?: string;
    prompt_used: string;
    tags: string[];
    source: 'generated' | 'archive' | 'none';
    error?: string;
}

export interface CoraArchiveResult {
    url: string;
    tags: string;
    prompt: string;
    score: number;
}

export interface CoraArchiveResponse {
    results: CoraArchiveResult[];
}

/**
 * Generate a historical illustration for an etymological entry.
 * 
 * @param word - The word to generate an illustration for
 * @param etymologyContext - Optional context about the word's etymology
 * @param visualPrompt - Optional pre-made visual prompt from Cledor (preferred workflow)
 * @param style - Visual style (default: 'historical_illustration')
 * @returns Illustration data with image URL, base64, and metadata
 * 
 * @example
 * // Cledor → Cora workflow (preferred)
 * const result = await generateIllustration(
 *   'amour',
 *   'From Latin amor',
 *   'A tender scene in ancient Rome, lovers exchanging gifts under marble columns...'
 * );
 */
export async function generateIllustration(
    word: string,
    etymologyContext?: string,
    visualPrompt?: string,
    style: string = 'historical_illustration'
): Promise<CoraIllustrationResponse> {
    try {
        const response = await fetch(`${CORA_API_URL}/api/v1/generate_illustration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word,
                etymology_context: etymologyContext,
                visual_prompt: visualPrompt,
                style
            }),
            // Timeout after 30 seconds (generation can take time)
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
            throw new Error(`Cora API error: ${response.status} ${response.statusText}`);
        }

        const data: CoraIllustrationResponse = await response.json();
        return data;

    } catch (error) {
        console.error('[Cora Client] Generation failed:', error);

        // Return a failed response instead of throwing
        return {
            success: false,
            prompt_used: `Visual representation of "${word}"`,
            tags: [],
            source: 'none',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Search the visual archive for relevant historical artifacts.
 * 
 * @param query - Search query (e.g., "roman soldier", "medieval manuscript")
 * @param limit - Maximum number of results (default: 5)
 * @returns Array of archive results with URLs and metadata
 */
export async function searchArchive(
    query: string,
    limit: number = 5
): Promise<CoraArchiveResponse> {
    try {
        const url = new URL(`${CORA_API_URL}/api/v1/search_archive`);
        url.searchParams.append('query', query);
        url.searchParams.append('limit', limit.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`Archive search error: ${response.status}`);
        }

        const data: CoraArchiveResponse = await response.json();
        return data;

    } catch (error) {
        console.error('[Cora Client] Archive search failed:', error);
        return { results: [] };
    }
}

/**
 * Check if the Cora API is healthy and reachable.
 * 
 * @returns True if API is healthy, false otherwise
 */
export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${CORA_API_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.status === 'healthy';

    } catch (error) {
        console.error('[Cora Client] Health check failed:', error);
        return false;
    }
}
