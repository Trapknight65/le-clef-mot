# PROGRESS.md

## [COMPLETED]

- [x] Initial Next.js 16 Scaffolding and Neon Design System.
- [x] Firebase integration for authentication and data persistence.
- [x] Pinecone vector search for semantic etymology matching.
- [x] Cora API (v1) with FLUX and Archive fallback.
- [x] **AirLLM & Ollama Engine Enhancement**: Local inference support for Curator and Engine.
- [x] Unified deployment script (direct_push.py) for Hugging Face Spaces.
- [x] **Project Memory Initialization**: Documentation stack (PROJECT_CONTEXT.md, ARCHITECTURE.md, DECISIONS.md, PROGRESS.md).
- [x] **Successful Deployment (Backend)**: Updated Cora Space on Hugging Face (`tokgae/cora`).
- [x] **Successful Deployment (Frontend)**: Deployed Next.js app on Vercel with updated `CORA_API_URL`.

## [IN PROGRESS]

## [NEXT STEPS]

- [ ] Verify production API connection from Web to HF Spaces.
- [ ] Implement Semantic Graphs for visual language evolution.
- [ ] Add user feedback loop for generated illustrations.
- [ ] Batch pre-generation for top 1000 French words.

## Technical Debt

- [ ] Local SD generation via AirLLM is currently a placeholder (implementation pending robust SDXL local loading).
- [ ] YOLOv8 detection in CoraVision is on-device; might need optimization for container startup.
