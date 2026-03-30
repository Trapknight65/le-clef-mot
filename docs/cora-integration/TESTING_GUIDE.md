# Cora API Integration - Testing Guide

## Quick Start Local Testing

### Step 1: Start Cora API

```powershell
cd C:\Users\Administrador\cora
python etymology_api.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 2: Verify Cora API Health

Open a new terminal:

```powershell
curl http://localhost:8000/health
```

**Expected response:**
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

### Step 3: Start Le Clef Mot

```powershell
cd c:\Users\Administrador\le_clef_mot\web
npm run dev
```

**Expected output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

### Step 4: Test Etymology Generation

1. Open browser: `http://localhost:3000`
2. Search for a word (e.g., "amour", "travail", "liberté")
3. Wait for etymology page to load
4. Verify image appears in the visual card

---

## Verification Checklist

### ✅ Backend Integration
- [ ] Cora API starts without errors
- [ ] `/health` endpoint returns healthy status
- [ ] Next.js dev server starts without errors
- [ ] No TypeScript compilation errors

### ✅ API Communication
- [ ] Etymology page makes request to `http://localhost:8000/api/v1/generate_illustration`
- [ ] Request includes `word` and `etymology_context`
- [ ] Response returns `success: true`
- [ ] Image URL is valid and accessible

### ✅ Image Display
- [ ] Image loads in ResultsDashboard visual card
- [ ] Cora commentary appears in overlay
- [ ] Source badge shows "Generative (Flux)" or "Historical Archive"
- [ ] No broken image placeholders

### ✅ Error Handling
- [ ] Stop Cora API mid-request → graceful error message
- [ ] Invalid word → fallback placeholder image
- [ ] Network timeout → error handled without crash

---

## Testing Specific Scenarios

### Test Case 1: Generation Success
**Word:** "mercenaires"  
**Expected:** Generated image from FLUX model  
**Verify:** `source: "generated"` in console logs

### Test Case 2: Archive Fallback
**Trigger:** Stop Fal.ai generation (simulate 402 error)  
**Expected:** Museum artifact served instead  
**Verify:** `source: "archive"` in response

### Test Case 3: Complete Failure
**Trigger:** Stop Cora API entirely  
**Expected:** Placeholder image with error message  
**Verify:** Page doesn't crash, fallback placeholder visible

---

## Browser Console Debugging

Open DevTools (F12) → Console tab. Look for:

```
[Cledor] Analysis starting for: amour
[Cledor] Requesting illustration from Cora API...
[Cledor] Complete! Image source: generated
```

**Network tab:**
- Request URL: `http://localhost:8000/api/v1/generate_illustration`
- Method: POST
- Status: 200
- Response time: 8-15 seconds (normal for generation)

---

## Common Issues & Solutions

### Issue: "Failed to fetch"

**Symptom:** Browser console shows `TypeError: Failed to fetch`

**Solution:**
1. Verify Cora API is running: `curl http://localhost:8000/health`
2. Check CORS settings in `etymology_api.py` (should include `http://localhost:3000`)
3. Verify `.env.local` has `CORA_API_URL=http://localhost:8000`

---

### Issue: "Connection Refused"

**Symptom:** `ERR_CONNECTION_REFUSED` in browser

**Solution:**
1. Ensure Cora API started successfully
2. Check port 8000 is not blocked by firewall
3. Try `http://localhost:8000/health` in browser directly

---

### Issue: Images don't display

**Symptom:** Placeholder shows instead of generated image

**Solution:**
1. Check browser console for errors
2. Verify `image_url` in API response is accessible
3. Test image URL directly in browser
4. Check if served from `http://localhost:8000/archive_images/...`

---

### Issue: Slow generation (> 30 seconds)

**Symptom:** Page hangs during generation

**Solution:**
1. Check Fal.ai API key is valid in Cora `.env`
2. Check Fal.ai account has remaining credits
3. Archive fallback will trigger automatically after timeout

---

## Performance Benchmarks

| Operation | Expected Time |
|-----------|---------------|
| Etymology generation (Cledor) | 2-5 seconds |
| Image generation (Cora API) | 8-15 seconds |
| Archive fallback (on 402) | 0.5-2 seconds |
| Total page load (cold) | 10-20 seconds |
| Total page load (cached) | 0.5-2 seconds |

---

## Next Steps After Testing

- [ ] Test with 10+ different words
- [ ] Verify caching works (reload same word)
- [ ] Test mobile responsiveness
- [ ] Configure Vercel environment variables
- [ ] Deploy Cora API to production (Railway/Fly.io)

---

## Production Deployment Notes

### Vercel Environment Variables

Add to Vercel dashboard:

```
CORA_API_URL=https://your-cora-production-url.railway.app
```

### Update CORS in Cora API

Before deploying, update `etymology_api.py`:

```python
allow_origins=[
    "https://your-actual-domain.vercel.app",
    "https://*.vercel.app"  # For preview deployments
]
```

---

For full deployment guide, see: [`docs/cora-integration/INTEGRATION_GUIDE.md`](../docs/cora-integration/INTEGRATION_GUIDE.md)
