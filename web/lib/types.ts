export interface Scene {
    scene_index: number;
    video_uri: string;
    prompt: string;
}

export interface ChronologyEra {
    era: string;
    form: string;
    meaning: string;
    story: string;
}

// Re-export EtymologyData (merged with CledorResponse for now)
export type EtymologyData = CledorResponse;

export interface CledorResponse {
    meta: {
        word: string;
        ipa: string;
        part_of_speech: string;
    };
    root_analysis: {
        root: string;
        original_meaning: string;
        concept: string;
    };
    narrative_chronology: ChronologyEra[];
    semantic_soul: {
        description: string;
        mnemonic: string;
    };
    visual_prompt: string;
    // Enriched fields (added by API)
    image_url?: string;
    image_query?: string; // Legacy/Fallback

    // Cora additions
    cora?: {
        curator_comment: string;
        flux_generation: {
            concept: string;
            prompt: string;
            aspect_ratio: string;
        };
        serp_search: {
            intent: string;
            queries: string[];
        };
        historical_image?: string; // Result from SerpApi
        generated_image?: string; // Result from Bytez
    };
}

// David (Director) Schema
export interface TimelineScene {
    scene_id: number;
    duration: number; // in seconds
    visual_source: "Flux-Generated" | "Stock-Video" | "Text-Only" | "Selfie-Mode-Avatar" | "Text-Motion";
    visual_description: string;
    overlay_text: string;
    voiceover_script: string;
    transition: string;
}

export interface VideoScript {
    video_meta: {
        title: string;
        total_duration: number;
        bg_music_mood: string;
    };
    timeline: TimelineScene[];
}

// Validation Schema for Cora Output
export interface CoraResponse {
    curator_comment: string;
    flux_generation: {
        concept: string;
        prompt: string;
        aspect_ratio: string;
    };
    serp_search: {
        intent: string;
        queries: string[];
    };
}
