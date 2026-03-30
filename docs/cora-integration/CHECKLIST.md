# Cora → Le Clef Mot: Implementation Checklist

## Phase 1: Core Integration ✓

### Backend Service
- [x] Cora API exists at `C:\Users\Administrador\cora\etymology_api.py`
- [x] Endpoints defined: `/api/v1/generate_illustration`, `/api/v1/search_archive`, `/health`
- [x] RAG fallback implemented via CoraMemory
- [ ] CORS configured for production domains
- [ ] Production deployment (Railway/Fly.io)

### Frontend Integration
- [ ] Create Cora API client (`web/lib/services/coraClient.ts`)
- [ ] Remove Fal.ai direct dependency from `cledor.ts`
- [ ] Replace generation logic to call Cora API
- [ ] Update error handling for new response format
- [ ] Add environment variable `CORA_API_URL`

### Configuration
- [ ] Update `.env.local` with `CORA_API_URL=http://localhost:8000`
- [ ] Update Vercel environment variables
- [ ] Test CORS with production domain

---

## Phase 2: Testing & Validation

### Local Testing
- [ ] Start Cora API: `python etymology_api.py`
- [ ] Start Next.js: `npm run dev`
- [ ] Test etymology generation for 5+ words
- [ ] Verify images display correctly in ResultsDashboard
- [ ] Test archive fallback (simulate 402 error)
- [ ] Check browser console for errors

### Production Testing
- [ ] Deploy Cora API to Railway/Fly.io
- [ ] Update Vercel env vars
- [ ] Deploy Next.js to Vercel
- [ ] Test end-to-end flow in production
- [ ] Monitor API latency and error rates

---

## Phase 3: Optimization

### Performance
- [ ] Implement response caching in Cora API
- [ ] Add CDN for archive images
- [ ] Pre-generate top 100 French words
- [ ] Add request timeouts (10s max)

### Monitoring
- [ ] Add logging to Cora API endpoints
- [ ] Track generation vs archive fallback ratio
- [ ] Monitor Fal.ai budget usage
- [ ] Set up error alerting

---

## Phase 4: Documentation

- [x] Create integration guide
- [ ] Update main README with architecture diagram
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Update API changelog

---

## Known Issues & TODOs

- [ ] Remove unused `fal.ts` dependency after migration
- [ ] Remove SerpApi logic from `cledor.ts` (now handled by Cora API)
- [ ] Update `types.ts` to match new Cora response format
- [ ] Consider removing embedded Cora agent prompts from `cledor.ts`

---

## Success Criteria

✅ Etymology pages load with Cora-generated illustrations  
✅ Archive fallback works when generation fails  
✅ Page load time < 5 seconds  
✅ No CORS errors in browser console  
✅ Both services deployed and communicating in production
