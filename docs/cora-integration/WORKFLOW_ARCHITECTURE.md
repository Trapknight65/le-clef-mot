# Cledor → Cora Workflow Architecture

## Overview

The **Cledor → Cora** workflow is a two-stage pipeline where:
1. **Cledor** (etymologist) analyzes the word's history and crafts a visual prompt
2. **Cora** (visual archivist) executes the prompt by generating or retrieving historical illustrations

This architecture separates **semantic analysis** from **visual execution**, allowing each agent to specialize.

---

## Workflow Diagram

```mermaid
graph LR
    A[User searches word] --> B[Cledor Analysis]
    B --> C{Visual RAG?}
    C -->|Archive found| D[Context enrichment]
    C -->|No archive| E[General knowledge]
    D --> F[Cledor generates visual_prompt]
    E --> F
    F --> G[Cora API receives prompt]
    G --> H{Generation}
    H -->|Success| I[Return generated image]
    H -->|402 error| J[RAG fallback]
    J --> K[Return museum artifact]
    I --> L[Display in ResultsDashboard]
    K --> L
```

---

## Agent Responsibilities

### Cledor (Etymologist)
**Location:** `web/lib/cledor.ts`  
**Role:** Semantic analysis and narrative generation

**Responsibilities:**
- Trace word etymology from modern form → Latin/Greek → Proto-Indo-European
- Analyze semantic shifts across historical eras
- Generate narrative chronology (story of the word's evolution)
- **Craft visual prompt** inspired by:
  - Historical texts mentioned in etymology
  - Cultural scenes from the word's origin era
  - Symbolic representations of the root concept

**Output:**
```typescript
{
  meta: { word, ipa, part_of_speech },
  root_analysis: { root, original_meaning, concept },
  narrative_chronology: [{ era, form, meaning, story }],
  semantic_soul: { description, mnemonic },
  visual_prompt: "A tender scene in ancient Rome..." // ✨ Handed to Cora
}
```

---

### Cora (Visual Archivist)
**Location:** `C:\Users\Administrador\cora\etymology_api.py`  
**Role:** Visual execution and archive management

**Responsibilities:**
- Receive visual prompt from Cledor
- Attempt image generation via FLUX (Fal.ai)
- On 402 error → fallback to museum archive (RAG)
- Tag and classify generated/retrieved images
- Serve images with metadata (source, tags, prompt_used)

**Input:**
```json
{
  "word": "amour",
  "etymology_context": "Root: amor...",
  "visual_prompt": "A tender scene in ancient Rome..." // From Cledor
}
```

**Output:**
```json
{
  "success": true,
  "image_url": "http://localhost:8000/archive_images/etym_amour_a3f4.png",
  "prompt_used": "A tender scene in ancient Rome...",
  "tags": ["person", "romance", "etymology:amour"],
  "source": "generated" // or "archive"
}
```

---

## Integration Points

### 1. Cledor generates visual prompt
**File:** `web/lib/cledor.ts` (lines 112-150)

Cledor uses the LLM system prompt to generate a `visual_prompt`:

```typescript
// Cledor's system prompt instructs it to generate visual_prompt
const cledorSchema = z.object({
  // ... other fields
  visual_prompt: z.string()
});
```

**Example prompts Cledor generates:**
- *"amour"* → "A tender scene in ancient Rome, lovers exchanging gifts under marble columns, soft golden light..."
- *"mercenaires"* → "Roman soldiers in armor receiving payment in silver coins, military camp background..."
- *"liberté"* → "Breaking chains in ancient forum, symbolic representation of freedom concept..."

---

### 2. Cledor hands prompt to Cora
**File:** `web/lib/cledor.ts` (lines 192-195)

```typescript
// Call Cora API with Cledor's visual prompt
// Workflow: Cledor analyzes etymology → generates visual prompt → Cora executes
const coraResult = await generateIllustration(
    word,
    etymologyContext,
    aiData.visual_prompt  // ✨ Cledor's crafted prompt
);
```

---

### 3. Cora executes prompt
**File:** `C:\Users\Administrador\cora\etymology_api.py` (lines 72-85)

```python
# Step 1: Determine prompt to use
if request.visual_prompt:
    # Cledor already generated the prompt, use it directly
    refined_prompt = request.visual_prompt
    print(f"[Cora API] Using Cledor's visual prompt: {refined_prompt[:100]}...")
else:
    # Fallback: Build prompt from etymology data
    refined_prompt = curator.refine_prompt(base_prompt)
    print(f"[Cora API] Curator refined prompt: {refined_prompt[:100]}...")
```

**Priority:**
1. **Cledor's visual_prompt** (preferred) → Direct execution
2. **Etymology context** (fallback) → CoraCurator refines it
3. **Word only** (last resort) → Minimal prompt

---

## Historical Inspiration Sources

Cledor can draw visual inspiration from:

### 1. Historical Texts
When etymology references specific documents:
- *"testament"* → Visual of Hebrew Torah scroll
- *"gospel"* → Medieval illuminated manuscript
- *"thesis"* → Ancient Greek philosophical debate scene

### 2. Cultural Scenes
When word origin ties to cultural practices:
- *"symposium"* → Greek drinking party with reclining figures
- *"carnival"* → Medieval farewell-to-meat festival
- *"sabbath"* → Ancient Jewish day of rest ritual

### 3. Symbolic Representations
When root concept is abstract:
- *"philosophy"* (*philo-* love + *-sophia* wisdom) → Wise elder teaching under tree
- *"democracy"* (*demos* people + *-kratia* rule) → Citizens voting in Athens agora

---

## Fallback Mechanisms

### Level 1: Cledor visual_prompt provided
✅ **Optimal path**  
Cora receives detailed, historically-informed prompt → Direct execution

### Level 2: Etymology context only
⚠️ **Fallback**  
CoraCurator refines raw etymology data into visual prompt → Execution

### Level 3: Generation fails (402 error)
🔄 **RAG fallback**  
CoraMemory searches museum archive → Returns relevant artifact

### Level 4: Complete failure
❌ **Graceful degradation**  
Return placeholder image with error metadata → Page doesn't crash

---

## Example Workflow Trace

**Word:** "mercenaires"

### Step 1: Cledor Analysis
```typescript
[Cledor] Analysis starting for: mercenaires
[Cledor] RAG Hit: Roman military equipment (shield, sword)
[Cledor] Generating etymology narrative...
[Cledor] Handing visual prompt to Cora API...
[Cledor] Visual Prompt: "Roman mercenaries in military armor receiving payment in silver coins, detailed historical scene, cinematic lighting, 8k, photorealistic..."
```

### Step 2: Cora Execution
```python
[Cora API] Using Cledor's visual prompt: Roman mercenaries in military armor receiving payment in silver coins...
[Cora Engine] Attempting generation via FLUX...
[Cora Engine] Success! Image generated: etym_mercenaires_a3f4.png
```

### Step 3: Response
```json
{
  "success": true,
  "image_url": "http://localhost:8000/archive_images/etym_mercenaires_a3f4.png",
  "prompt_used": "Roman mercenaries in military armor...",
  "tags": ["person", "armor", "weapon", "etymology:mercenaires"],
  "source": "generated"
}
```

---

## Benefits of This Architecture

1. **Separation of Concerns**  
   - Cledor = Semantic expert (history, meaning, narrative)
   - Cora = Visual expert (generation, archiving, fallback)

2. **Historically Accurate Visuals**  
   Cledor's deep etymology analysis ensures visual prompts are historically contextualized

3. **Graceful Degradation**  
   Multiple fallback layers ensure users always get *something* visual

4. **Reusability**  
   Cora can be used by other applications beyond Le Clef Mot

5. **Testability**  
   Each agent can be tested independently

---

## Configuration

### Environment Variables

**Le Clef Mot (Next.js):**
```bash
CORA_API_URL=http://localhost:8000  # Local dev
CORA_API_URL=https://cora.railway.app  # Production
```

**Cora API (Python):**
```bash
FAL_KEY=your_fal_api_key  # For FLUX generation
```

### CORS Configuration

`etymology_api.py`:
```python
allow_origins=[
    "http://localhost:3000",           # Next.js dev
    "https://your-domain.vercel.app",  # Production
]
```

---

## Related Documentation

- [Cora Integration Guide](./INTEGRATION_GUIDE.md) - Full integration steps
- [API Specification](./API_SPEC.md) - Endpoint details
- [Testing Guide](./TESTING_GUIDE.md) - How to test the integration

---

**Last Updated:** 2026-02-06  
**Status:** ✅ Fully integrated and deployed to production
