---
trigger: always_on
---

# TypeScript & Linting Optimization Rules

- **Type Safety**: Use the strictest TypeScript settings. NEVER use `any`. Use `unknown` or `Zod` for validation if types are uncertain.
- **Workflow**: Before proposing any code change, the agent MUST run `npx tsc --noEmit` and `npx eslint .`.
- **Auto-Fix**: If linting errors occur, the agent should attempt to fix them using `--fix` before asking for human intervention.
- **Functional Patterns**: Prefer functional programming and arrow functions. Avoid classes to reduce boilerplate memory overhead.
- **Error Handling**: Every async function must have a try/catch block or a `.catch()` handler to prevent "floating promise" lint errors.
