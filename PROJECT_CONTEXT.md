# PROJECT_CONTEXT.md

## Overview

**Le Clef Mot** ("The Key Word") is a neon-noir etymological analytical engine designed to unlock the soul of language through deep root analysis and neural illumination. It provides AI-powered linguistic insights and historical visualizations for French word origins.

## High-Level Goals

- Illuminate word origins using vector embeddings and LLMs.
- Provide immersive, high-contrast neon aesthetics for linguistic data.
- Integrate a robust visual generation pipeline (Cora) for historical context.
- Support bilingual fluidity (EN/FR).

## Tech Stack

- **Frontend**: Next.js 16, React 19, Framer Motion, Tailwind CSS 4.
- **Backend**: Firebase (Auth/Firestore), Pinecone DB (Vector Search).
- **Intelligence**: Vercel AI SDK, OpenAI, LangChain.
- **Visual Generation**: Cora API (FastAPI) -> Fal.ai/FLUX / Hugging Face.

## Personas

- **The Etymologist**: Interested in deep semantic tracing and historical accuracy.
- **The Visual Storyteller**: Seeks aesthetic immersion and visual metaphors for language.
- **The Linguistic Explorer**: Casual user interested in the "soul" behind words.

## Setup

1.  Clone both `le_clef_mot` and `cora` repositories.
2.  Configure `.env.local` in `web/` with Firebase, Pinecone, and CORA_API_URL.
3.  Configure `.env` in `cora/` with HF_TOKEN and OLLAMA settings.
4.  Run Cora: `python app.py` (Port 7860/8000).
5.  Run Web: `npm run dev` (Port 3000).
