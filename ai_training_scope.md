# The AI Training Scope: A Chronicle of Evolution

> "In the beginning, there was noise. And we sought to tune it into a signal."

## I. Executive Summary: The Narrative Arc
This document traces the trajectory of Artificial Intelligence integration within the `le_clef_mot` workspace. It is not merely a technical log but an observation of a system finding its voice.

The journey describes a distinct pivot: moving from a constrained, monolithic attempt (Bytez) to a modular, high-performance orchestration (Groq & Fal.ai). This shift was not just operational; it was philosophical—moving from "making it work" to "making it sing." The result is a system capable of **Visual RAG** (Retrieval-Augmented Generation), where narrative and imagery dance in real-time.

## II. Chronological Evolution

### Phase 1: The Friction (The Bytez Era)
*Context: Early January 2026*

The initial "gameplay loop" was built around **Bytez**, attempting to utilize `FLUX.2-dev-Turbo` for image generation.
*   **The Dissonance**: The system hit a hard ceiling. The API returned "Please upgrade your account," a breach of the implicit player contract. Even with credits, the model size limitations on the free plan created a "dead end" in the user journey.
*   **The Observation**: The tool was fighting the artist. instead of enabling flow, it introduced friction.

### Phase 2: The Modulation (The Pivot)
*Context: January 8, 2026*

A strategic decision was made to decouple the modalities. We deconstructed the "monolith" into specialized instruments.
*   **Text Generation**: Switched to **Groq** hosting `llama-3.3-70b-versatile`.
    *   *Why*: Speed and context window. A loose, lyrical model capable of nuance.
*   **Image Generation**: Switched to **Fal.ai** hosting `fal-ai/flux/dev`.
    *   *Why*: Reliability and quality. A visual synthesizer that respects the prompt's geometry.
*   **The Code**: New libraries were composed (`lib/fal.ts`) to handle this specific handshake.

### Phase 3: The Symphony (Integration & Visual RAG)
*Context: Mid-January 2026*

With the bedrock stable, the focus shifted to the "cinematic experience."
*   **Visual RAG**: The system now retrieves context and generates accompanying visuals dynamically.
*   **Narrative Synthesis**: The AI doesn't just "answer"; it weaves a story, supported by the `ResultsDashboard`.
*   **Refinement**:
    *   *Geometry*: The video player was retuned to fit the diamond geometry of the portal (Jan 14).
    *   *Aesthetics*: Buttons were ghosted, controls were hidden until needed—the UI became a "transparent interface" (Jan 15).
    *   *Mock Data Modulation*: Realism was injected into user metrics (Spotify, TikTok counts) to test the system's reaction to "success" (Jan 15).

## III. Technical Footprint

The following artifacts represent the "score" of this composition:

| Component | Technology / Model | File Path | Function |
| :--- | :--- | :--- | :--- |
| **Logic Core** | `llama-3.3-70b-versatile` (via Groq) | `/api/search` | Narrative generation and synthesis. |
| **Visual Core** | `fal-ai/flux/dev` (via Fal.ai) | `/api/generate-image`, `lib/fal.ts` | Dynamic image generation based on context. |
| **Environment** | configuration | `.env.local` | Stores `FAL_KEY`, `GROQ_API_KEY`. |
| **UI Surface** | Next.js / React | `ResultsDashboard.tsx` | The canvas where the AI's output is rendered. |

## IV. Reflection

The system has matured from a rigid input-output machine into a responsive, jazz-like entity. The AI does not just training on data; it is training on *style*. The move to modular APIs allows us to swap out the "instruments" (models) without tearing down the stage (application logic).

*Documented by The Chronicler, Jan 21, 2026.*
