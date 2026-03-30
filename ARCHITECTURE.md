# ARCHITECTURE.md

## System Overview

Le Clef Mot follows a distributed intelligence architecture, separating linguistic analysis (Web) from visual generation (Cora).

## Data Flow

```mermaid
graph TD
    User((User)) -->|Search| Web[Next.js Frontend]
    Web -->|Linguistic Analysis| LLM_Web[Groq/Llama/OpenAI]
    Web -->|Visual Query| Cora[Cora API - FastAPI]

    subgraph Cora_Platform
        Cora -->|Refine| Curator[CoraCurator]
        Curator -->|Local LLM| Ollama[Ollama / AirLLM]
        Cora -->|Generate| Engine[CoraEngine]
        Engine -->|Stable Diffusion| SD[Fal.ai / HF / local]
        Engine -->|Fallback| Memory[CoraMemory - ChromaDB]
        Memory -->|Semantic Search| Archive[Museum Archive]
    end

    Web -->|Store Results| Firebase[Firestore]
```

## Folder Structure

- `web/`: Next.js application (Frontend & Edge Logic).
- `cora/`: Visual Etymology Engine (Python/FastAPI).
  - `cora_curator.py`: Prompt refinement (Ollama, AirLLM, HF).
  - `cora_engine.py`: Image generation and fallbacks.
  - `cora_memory.py`: Semantic archive management.
  - `app.py`: Unified Gradio UI + FastAPI endpoint.
- `flowise/`: LangChain/Flowise experimental prompts and logic.
- `docs/`: Integration and API specifications.

## Memory & Caching

- **Firestore**: Primary cache for generated etymology data.
- **ChromaDB**: Vector store for image-prompt pairings (Inside Cora).
- **Pinecone**: Global vector search for semantic word mapping.
