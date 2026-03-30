# DECISIONS.md

## 2026-03-06: Local Inference with AirLLM and Ollama

- **Context**: Budget constraints on cloud APIs (Fal.ai, HF Inference endpoints) and the need for high-quality refinement on large models.
- **Decision**: Integrated `AirLLM` and `Ollama` into the Cora engines, and updated `CORA_API_URL` to the production Hugging Face Space: `https://tokgae-cora.hf.space`.
- **Trade-off**: Local inference requires significant GPU RAM (leveraging AirLLM's layer splitting), but provides infinite free iterations and high-quality prompt enrichment via Llama-3-70B.
- **Fallback**: Maintained a tiered strategy: AirLLM -> Ollama -> HF Cloud -> original prompt.

## 2026-03-06: Unified Cora Entry Point

- **Context**: Simplify deployment to Hugging Face Spaces.
- **Decision**: Merged FastAPI backend and Gradio UI into `app.py`.
- **Trade-off**: Slightly more complex script but ensures a single container can handle both API requests and manual tests.

## 2026-02-15: Next.js 16 + Tailwind CSS 4

- **Context**: Modernizing the frontend stack.
- **Decision**: Adopted Tailwind CSS 4 for native CSS-variable based styling and Next.js 16 for edge performance.
- **Trade-off**: Bleeding edge dependencies may have minor stability issues, but provide superior DX and performance.
