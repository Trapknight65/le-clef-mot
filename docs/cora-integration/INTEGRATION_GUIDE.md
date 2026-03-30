# Cora API Integration Guide

## Overview

This document describes the integration between **Le Clef Mot** (Next.js etymology frontend) and **Cora** (Python-based visual generation API).

**Cora** provides AI-powered historical illustration generation with intelligent fallback to museum archives when generation fails or budget is exhausted.

---

## Architecture

```
Le Clef Mot (Next.js Frontend)
    ├── User searches for French word
    ↓
    Server-Side Etymology Generation (cledor.ts)
    ├── Generate linguistic analysis (Groq/Llama)
    ├── Extract visual prompt data
    ↓
    HTTP POST → Cora API (Python FastAPI)
    ├── CoraCurator: Refine visual prompt
    ├── CoraEngine: Generate image (Fal.ai/FLUX)
    └── (on 402 error) → CoraMemory: RAG search museum archives
    ↓
    Response: Image URL + Base64 + Metadata
    ↓
    Cache in Firestore + Display in ResultsDashboard
```

---

## API Endpoints

### 1. Generate Illustration

**Endpoint:** `POST /api/v1/generate_illustration`

**Purpose:** Generate a historical illustration for an etymological entry.

**Request Body:**
```json
{
  "word": "mercenaires",
  "etymology_context": "From Latin 'mercenarius' meaning hired soldier, derived from 'merces' (wages, pay)",
  "style": "historical_illustration"
}
```

**Response:**
```json
{
  "success": true,
  "image_url": "http://localhost:8000/archive_images/etym_mercenaires_a3f4.png",
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "prompt_used": "Historical scene depicting Roman mercenaries in ancient armor...",
  "tags": ["person", "armor", "weapon", "etymology:mercenaries"],
  "source": "generated"
}
```

**Error Response (Generation Failed, Archive Served):**
```json
{
  "success": true,
  "image_url": "http://localhost:8000/archive_images/met_12345.jpg",
  "image_base64": "...",
  "prompt_used": "Roman military equipment",
  "tags": ["met_museum_open_access", "armor"],
  "source": "archive"
}
```

---

### 2. Search Archive

**Endpoint:** `GET /api/v1/search_archive?query=roman&limit=5`

**Purpose:** Search the visual archive for relevant historical artifacts.

**Response:**
```json
{
  "results": [
    {
      "url": "http://localhost:8000/archive_images/met_12345.jpg",
      "tags": "roman,met_museum_open_access,armor",
      "prompt": "Roman legionary armor",
      "score": 0.23
    }
  ]
}
```

---

### 3. Health Check

**Endpoint:** `GET /health`

**Purpose:** Verify API status and component health.

**Response:**
```json
{
  "status": "healthy",
  "components": {
    "engine": true,
    "curator": true,
    "vision": true,
    "memory": true
  }
}
```

---

## Integration Implementation

### Step 1: Create Cora API Client

**File:** `web/lib/services/coraClient.ts`

```typescript
interface CoraIllustrationRequest {
  word: string;
  etymology_context?: string;
  style?: string;
}

interface CoraIllustrationResponse {
  success: boolean;
  image_url?: string;
  image_base64?: string;
  prompt_used: string;
  tags: string[];
  source: 'generated' | 'archive' | 'none';
  error?: string;
}

export async function generateIllustration(
  word: string,
  etymologyContext?: string
): Promise<CoraIllustrationResponse> {
  const apiUrl = process.env.CORA_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${apiUrl}/api/v1/generate_illustration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      word,
      etymology_context: etymologyContext,
      style: 'historical_illustration'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Cora API error: ${response.status}`);
  }
  
  return await response.json();
}
```

---

### Step 2: Update Etymology Generation

**File:** `web/lib/cledor.ts`

**Before (using Fal.ai directly):**
```typescript
// Old: Direct Fal.ai call
const fluxResult = await generateImage(coraData.flux_generation.prompt);
```

**After (using Cora API):**
```typescript
import { generateIllustration } from '@/lib/services/coraClient';

// New: Call Cora API
const coraResult = await generateIllustration(
  word,
  `${aiData.root_analysis.root} - ${aiData.semantic_soul.description}`
);

const result: EtymologyData = {
  ...aiData,
  image_url: coraResult.image_url || '/placeholder.jpg',
  image_query: coraResult.prompt_used,
  cora: {
    curator_comment: `Visual source: ${coraResult.source}`,
    flux_generation: {
      concept: 'Historical Etymology Illustration',
      prompt: coraResult.prompt_used,
      aspect_ratio: '16:9'
    },
    serp_search: {
      intent: 'Historical Context',
      queries: [`etymology of ${word} visual`]
    },
    generated_image: coraResult.source === 'generated' ? coraResult.image_url : undefined,
    historical_image: coraResult.source === 'archive' ? coraResult.image_url : undefined,
    pinecone_retrieved_image: undefined
  }
};
```

---

### Step 3: Environment Configuration

**Development (.env.local):**
```bash
CORA_API_URL=http://localhost:8000
```

**Production (Vercel Environment Variables):**
```bash
CORA_API_URL=https://your-cora-api.railway.app
```

---

### Step 4: CORS Configuration

**File:** `C:\Users\Administrador\cora\etymology_api.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Development
        "https://le-mot-clef.vercel.app",  # Production
        "https://*.vercel.app"             # Preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Deployment

### Local Development

**Terminal 1 - Cora API:**
```bash
cd C:\Users\Administrador\cora
python etymology_api.py
# Running on http://0.0.0.0:8000
```

**Terminal 2 - Le Clef Mot:**
```bash
cd c:\Users\Administrador\le_clef_mot\web
npm run dev
# Running on http://localhost:3000
```

---

### Production Deployment

**Option 1: Railway (Recommended for FastAPI)**

1. Create new project on [Railway.app](https://railway.app)
2. Connect GitHub repo for Cora
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn etymology_api:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (FAL_KEY, GROQ_API_KEY, etc.)
6. Deploy → Get production URL
7. Update Vercel env var: `CORA_API_URL=https://cora-api.railway.app`

**Option 2: Fly.io**

```bash
cd C:\Users\Administrador\cora
fly launch
fly deploy
```

---

## Error Handling & Fallback Strategy

### Generation Pipeline

1. **Primary:** Fal.ai FLUX generation via CoraEngine
2. **Fallback 1:** Museum archive search via CoraMemory (on 402 error)
3. **Fallback 2:** Placeholder image with error message

### Example Error Flow

```
User requests "gladiateur"
  → Cora API called with etymology context
  → CoraEngine attempts FLUX generation
  → 402 Payment Required (budget exhausted)
  → CoraMemory RAG search for "gladiator roman historical"
  → Returns Met Museum artifact image
  → Frontend displays with tag: "Historical Archive"
```

---

## Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test illustration generation
curl -X POST http://localhost:8000/api/v1/generate_illustration \
  -H "Content-Type: application/json" \
  -d '{"word": "amour", "etymology_context": "From Latin amor - strong affection"}'

# Test archive search
curl "http://localhost:8000/api/v1/search_archive?query=roman+soldier&limit=3"
```

### Integration Test

1. Start both services (Cora API + Next.js)
2. Navigate to `http://localhost:3000`
3. Search for "travail"
4. Verify etymology page loads with illustration
5. Check browser DevTools → Network tab for Cora API call
6. Inspect response includes `source: "generated"` or `source: "archive"`

---

## Monitoring & Analytics

### Key Metrics to Track

- **Generation Success Rate:** % of requests resulting in `source: "generated"`
- **Archive Fallback Rate:** % of requests resulting in `source: "archive"`
- **Average Latency:** Time from request to response
- **Error Rate:** % of requests with `success: false`

### Logging (Cora API)

```python
# Add to etymology_api.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/v1/generate_illustration")
async def generate_illustration(request: IllustrationRequest):
    logger.info(f"[Request] word={request.word}, source=etymology_app")
    # ... existing code
    logger.info(f"[Response] word={request.word}, source={source}, latency={elapsed}s")
```

---

## Troubleshooting

### Issue: Connection Refused

**Symptom:** Frontend shows "Failed to fetch illustration"

**Solution:**
1. Verify Cora API is running: `curl http://localhost:8000/health`
2. Check CORS settings allow frontend domain
3. Verify `CORA_API_URL` environment variable is set correctly

---

### Issue: 402 Payment Required (Fal.ai)

**Symptom:** All requests return archive images

**Solution:**
1. Check Fal.ai account balance
2. Verify `FAL_KEY` environment variable in Cora API
3. This is expected behavior when budget exhausted—RAG fallback is working as designed

---

### Issue: Slow Response Times

**Symptom:** Etymology pages take >10 seconds to load

**Solution:**
1. Implement caching in `cledor.ts` (already done via Firestore)
2. Reduce FLUX generation quality/steps in CoraEngine
3. Pre-generate illustrations for common words during off-peak hours
4. Consider CDN for archive images

---

## Future Enhancements

- [ ] Batch pre-generation for top 1000 French words
- [ ] User feedback loop (thumbs up/down on illustrations)
- [ ] Alternative art styles (woodcut, illuminated manuscript, etc.)
- [ ] Multi-language support (English, Spanish etymology)
- [ ] Integration with Archive Curator for intelligent curation

---

## Related Documentation

- [Cora Architecture](file:///C:/Users/Administrador/cora/docs/ARCHITECTURE.md)
- [Cora Setup Guide](file:///C:/Users/Administrador/cora/docs/SETUP.md)
- [Future Archive Curator](file:///C:/Users/Administrador/cora/docs/FUTURE_ARCHIVE_CURATOR.md)
- [Original Etymology API Spec](file:///C:/Users/Administrador/cora/docs/README_ETYMOLOGY_API.md)
