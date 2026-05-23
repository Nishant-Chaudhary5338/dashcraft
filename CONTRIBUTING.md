# Contributing to dashcraft

Thank you for helping make dashcraft better. This guide covers everything you need to contribute effectively.

---

## Quick start

```sh
# 1. Fork and clone
git clone https://github.com/<your-username>/dashcraft.git
cd dashcraft

# 2. Install dependencies (requires pnpm 9+)
pnpm install

# 3. Build the core library
pnpm --filter @dashcraft/core build

# 4. Run tests
pnpm --filter @dashcraft/core test

# 5. Start the product site
pnpm --filter @dashcraft/site dev
```

Requires **Node.js 20+** and **pnpm 9+**.

---

## What can I contribute?

- **Bug fixes** — found something broken? Fix it and open a PR
- **New features** — check existing issues first; open a discussion if unsure
- **Docs** — improve the product site (`apps/site/`), inline API docs, or this guide
- **Tests** — the core library has a Vitest suite; more coverage is always welcome
- **MCP server** — improvements to `tools/codegen/` (new tools, better prompts)

---

## How to add a new widget type

1. **Create the widget** in `packages/core/src/widgets/<name>/`
   - `NameWidget.tsx` — the React component
   - `index.ts` — barrel export
   - `name.types.ts` — TypeScript types if non-trivial

2. **Export it** from `packages/core/src/index.ts`

3. **Write tests** in `packages/core/src/__tests__/widgets/NameWidget.test.tsx`
   - Minimum: renders correctly, handles loading state, handles edge-case values

4. **Document it** — add prop table to `apps/site/app/docs/components/page.tsx`

5. **Add to playground** — add the widget type to `apps/site/components/playground/PlaygroundApp.tsx` palette

---

## How to add a new hook

1. Create `packages/core/src/hooks/useMyHook.ts`
2. Export from `packages/core/src/hooks/index.ts` and `packages/core/src/index.ts`
3. Write tests in `packages/core/src/__tests__/hooks/useMyHook.test.ts`
4. Add to `apps/site/app/docs/hooks/page.tsx`

---

## How to improve the MCP server

The MCP server lives in `tools/codegen/`. It has three tools:

- `analyze_dashboard` — Claude Vision analysis
- `generate_code` — TSX code generation
- `generate_project` — full project zip

```sh
cd tools/codegen
npm install
npm run build
```

Test it with Claude Desktop or via stdio directly.

---

## Code standards

These apply to all contributions:

### TypeScript
- Strict mode always — no `any`, no `@ts-ignore`
- Explicit return types on all exported functions
- Zod at API/form boundaries; built-in types everywhere else

### React
- Composition over prop drilling beyond 2 levels
- Custom hooks for stateful logic > 10 lines
- No `useEffect` for derived state — compute inline
- Stable list keys — never array index

### General
- No comments that restate the code
- Early returns over nested conditionals (max depth: 3)
- Named constants over magic numbers
- Files: ≤ 300 lines — split if larger

---

## PR checklist

Before opening a PR, confirm:

- [ ] `pnpm --filter @dashcraft/core build` passes (0 TypeScript errors)
- [ ] `pnpm --filter @dashcraft/core test` passes
- [ ] If new component/hook: docs page updated in `apps/site/`
- [ ] If new widget type: added to playground palette
- [ ] No committed `.env` files or API keys

---

## Commit style

Use conventional commits:

```
feat: add RadialBarWidget
fix: correct KPIWidget currency formatting for negative values
docs: add persistence guide to site
chore: upgrade recharts to 2.15.4
```

---

## Bug reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:
- Which component or hook is affected
- Minimal reproduction (StackBlitz or code snippet)
- Expected vs actual behaviour
- Node version, React version, @dashcraft/core version

---

## Feature requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Describe the problem first, then your proposed solution.

---

## Questions

Open a [GitHub Discussion](https://github.com/Nishant-Chaudhary5338/dashcraft/discussions) for questions that aren't bugs or feature requests.

---

Thanks for contributing 🙏
