# Cora Integration Documentation

This folder contains all documentation related to the integration between **Cora** (Python visual generation API) and **Le Clef Mot** (Next.js etymology frontend).

## Documents

### 📘 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
Complete integration guide covering:
- Architecture overview
- API endpoints
- Implementation steps
- Deployment strategies
- Error handling
- Testing procedures

**Start here** if you're implementing the integration for the first time.

---

### ✅ [CHECKLIST.md](./CHECKLIST.md)
Step-by-step implementation checklist organized by phase:
- Phase 1: Core Integration
- Phase 2: Testing & Validation
- Phase 3: Optimization
- Phase 4: Documentation

**Use this** to track progress during implementation.

---

### 📋 [API_SPEC.md](./API_SPEC.md)
Technical API specification including:
- Endpoint reference
- Request/response schemas
- Error codes
- Environment variables
- Performance benchmarks
- Deployment requirements

**Reference this** when working with the Cora API directly.

---

## Quick Start

### Local Development

**Terminal 1 - Start Cora API:**
```bash
cd C:\Users\Administrador\cora
python etymology_api.py
```

**Terminal 2 - Start Le Clef Mot:**
```bash
cd c:\Users\Administrador\le_clef_mot\web
npm run dev
```

**Terminal 3 - Test Integration:**
```bash
# Health check
curl http://localhost:8000/health

# Generate illustration
curl -X POST http://localhost:8000/api/v1/generate_illustration \
  -H "Content-Type: application/json" \
  -d '{"word": "amour", "etymology_context": "From Latin amor"}'
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│             Le Clef Mot (Next.js)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  User searches "travail"                          │  │
│  └───────────────┬───────────────────────────────────┘  │
│                  ↓                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  cledor.ts generates etymology                    │  │
│  └───────────────┬───────────────────────────────────┘  │
└──────────────────┼──────────────────────────────────────┘
                   ↓ HTTP POST
┌─────────────────────────────────────────────────────────┐
│          Cora API (Python FastAPI)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CoraCurator: Refine visual prompt               │  │
│  └───────────────┬───────────────────────────────────┘  │
│                  ↓                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CoraEngine: Generate via Fal.ai                 │  │
│  └───────────────┬───────────────────────────────────┘  │
│                  ↓ (on 402 error)                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CoraMemory: RAG search museum archives          │  │
│  └───────────────┬───────────────────────────────────┘  │
└──────────────────┼──────────────────────────────────────┘
                   ↓ JSON Response
┌─────────────────────────────────────────────────────────┐
│  {                                                       │
│    "success": true,                                      │
│    "image_url": "...",                                   │
│    "source": "generated" | "archive"                     │
│  }                                                       │
└──────────────────────────────────────────────────────────┘
```

---

## Key Benefits of This Integration

✅ **Intelligent Fallback:** When generation fails, serve museum artifacts instead of errors  
✅ **Cost Efficiency:** Automatic RAG fallback when Fal.ai budget exhausted  
✅ **Historical Accuracy:** Museum-verified images for etymology contexts  
✅ **Separation of Concerns:** Visual generation logic isolated from frontend  
✅ **Scalability:** Can serve multiple clients (not just Le Clef Mot)

---

## Related Resources

- **Cora Documentation:** `C:\Users\Administrador\cora\docs\`
- **Le Clef Mot Repo:** `c:\Users\Administrador\le_clef_mot\`
- **Implementation Plan:** `C:\Users\Administrador\.gemini\antigravity\brain\[conversation-id]\implementation_plan.md`

---

## Status

**Current Status:** 🟡 In Progress  
**Last Updated:** 2026-02-06  
**Next Milestone:** Create Cora API client + modify cledor.ts
