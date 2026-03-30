# Cora API Technical Specification

## Service Overview

**Name:** Cora Visual Etymology API  
**Version:** 1.0.0  
**Protocol:** FastAPI (Python 3.9+)  
**Default Port:** 8000  
**Base URL (Local):** `http://localhost:8000`

---

## Components

### CoraEngine
**Purpose:** Image generation orchestration  
**Provider:** Fal.ai (FLUX model)  
**Fallback:** CoraMemory RAG search

### CoraCurator
**Purpose:** Visual prompt refinement  
**Provider:** Groq (Llama-3.3-70b-versatile)

### CoraVision
**Purpose:** Image analysis and tagging  
**Tools:** YOLO v8, CLIP embeddings

### CoraMemory
**Purpose:** Visual knowledge base  
**Storage:** ChromaDB  
**Source:** Museum open-access collections (Met, Rijksmuseum, etc.)

---

## API Reference

### POST /api/v1/generate_illustration

Generate or retrieve a historical illustration.

**Request Schema:**
```typescript
{
  word: string;              // Required
  etymology_context?: string; // Optional
  style?: string;            // Default: "historical_illustration"
}
```

**Response Schema:**
```typescript
{
  success: boolean;
  image_url?: string;        // Public URL or localhost path
  image_base64?: string;     // Base64-encoded PNG (for offline use)
  prompt_used: string;       // Actual prompt sent to generator
  tags: string[];            // Detected objects/themes
  source: 'generated' | 'archive' | 'none';
  error?: string;            // Present if success = false
}
```

**Status Codes:**
- `200` - Success (generated or archive)
- `500` - Server error

**Example cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/generate_illustration \
  -H "Content-Type: application/json" \
  -d '{
    "word": "courage",
    "etymology_context": "From Latin cor (heart)",
    "style": "historical_illustration"
  }'
```

---

### GET /api/v1/search_archive

Search the visual archive by text query.

**Query Parameters:**
- `query` (string, required) - Search term
- `limit` (int, optional) - Max results (default: 5)

**Response Schema:**
```typescript
{
  results: Array<{
    url: string;
    tags: string;
    prompt: string;
    score: number;  // Cosine similarity (0-1)
  }>
}
```

**Example cURL:**
```bash
curl "http://localhost:8000/api/v1/search_archive?query=medieval+armor&limit=3"
```

---

### GET /health

Health check and component status.

**Response Schema:**
```typescript
{
  status: "healthy" | "degraded";
  components: {
    engine: boolean;
    curator: boolean;
    vision: boolean;
    memory: boolean;
  }
}
```

---

## Environment Variables

### Required
- `FAL_KEY` - Fal.ai API key for image generation
- `GROQ_API_KEY` - Groq API key for prompt refinement

### Optional
- `SERPAPI_KEY` - For web image search (deprecated, use archive instead)

---

## Error Handling

### 402 Payment Required (Fal.ai)
**Trigger:** Generation budget exhausted  
**Behavior:** Automatic fallback to CoraMemory archive search  
**Response:** `source: "archive"` with museum artifact

### Connection Timeout
**Trigger:** Fal.ai or Groq API unreachable  
**Behavior:** Return error response  
**Response:** `success: false, error: "Connection timeout"`

---

## Rate Limits

**Current:** None (local API)  
**Recommended for Production:**
- 10 requests/minute per IP (unauthenticated)
- 100 requests/minute per API key (authenticated)

---

## Performance Benchmarks

**Average Latency:**
- Generation (FLUX): 8-15 seconds
- Archive fallback: 0.5-2 seconds
- Archive search only: 0.2-0.5 seconds

**Throughput:**
- Concurrent requests: 3 (limited by Fal.ai backend)
- Queue depth: 10

---

## Data Privacy

**Stored Data:**
- Generated images (saved to `archive_images/` folder)
- Image embeddings (ChromaDB)
- Metadata (tags, prompts, timestamps)

**NOT Stored:**
- User IP addresses
- API request logs (beyond standard server logs)
- Personal information

**GDPR Compliance:**
- No cookies used
- No user tracking
- All data deletable on request

---

## Deployment Requirements

### System Requirements
- Python 3.9+
- 2GB RAM minimum (4GB recommended)
- 500MB disk space for ChromaDB
- 5GB disk space for archive images

### Dependencies
```txt
fastapi
uvicorn
Pillow
chromadb
openai
groq
fal-client
ultralytics
sentence-transformers
```

### Production Checklist
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS (handled by Railway/Fly.io)
- [ ] Enable logging (INFO level minimum)
- [ ] Set rate limiting middleware
- [ ] Configure CDN for `/archive_images` static files
- [ ] Set up health check monitoring
- [ ] Configure automatic restarts on crash

---

## Changelog

### v1.0.0 (2026-02-06)
- Initial release
- Etymology app integration endpoints
- RAG fallback system
- Museum archive integration

---

## Support & Contact

**Repository:** `C:\Users\Administrador\cora`  
**Maintainer:** Allan Deschamps (Redbrush Agency)  
**Related Project:** Le Clef Mot (etymology application)
