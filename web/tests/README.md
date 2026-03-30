# Development Cleanup Folders

This directory contains organized development artifacts that have been moved from the root `web/` directory to maintain a clean project structure.

## Folder Structure

### `tests/legacy/`
Legacy test files that were used during development but are no longer actively maintained. These files are preserved for reference but should not be run in CI/CD.

**Contents:**
- `test_backend.js` - Legacy backend API tests
- `test_vertex.js` - Vertex AI integration tests
- `test_vertex_sdk.js` - Vertex SDK tests
- `verify_api_route.js` - API route verification script
- `check_model.js` - Model checking utility

---

### `.dev-outputs/`
Temporary outputs from development testing, debugging, and build processes. These files are automatically excluded from version control.

**Contents:**
- `all_models.txt` - List of all AI models tested
- `model_output.txt` - Model generation outputs
- `tsc_output.txt` - TypeScript compiler outputs
- `verify_out.txt` / `verify_out_2.txt` - Verification script outputs
- `vertex_error.txt` / `vertex_sdk_error.txt` - Error logs from Vertex tests
- `env_temp` - Temporary environment configuration

---

## Gitignore Rules

Both folders are excluded from version control via `.gitignore`:

```gitignore
# Development cleanup folders
.dev-outputs/
tests/legacy/
```

---

## Maintenance

**When to clean these folders:**
- After major refactors or feature completions
- Before final deployment
- If folder size exceeds 50MB

**How to clean:**
```bash
# Remove all dev outputs
rm -rf .dev-outputs/*

# Remove legacy tests (only if confirmed obsolete)
rm -rf tests/legacy/*
```

---

## Related Documentation

- Main project README: [`../README.md`](../README.md)
- Active tests directory: [`../app/__tests__/`](../app/__tests__/) (if exists)
