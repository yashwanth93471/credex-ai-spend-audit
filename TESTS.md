# Tests

## Philosophy

The audit engine and catalog are the only parts of the app whose correctness
isn't visually obvious in the UI. Those get unit tests. Everything else
(form rendering, report rendering, email send) is verified by manual smoke
testing — appropriate for a 5-day MVP.

## Coverage

| Area              | Tests                                                          | Location                                    |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------- |
| Catalog sanity    | 5 — required tools present, unique IDs, unique plan IDs, pricing source format, model shape | `src/core/catalog/catalog.test.ts`         |
| Audit rules       | _Day 2_ — one per rule (6) + composite + no-findings           | `src/core/audit/rules/*.test.ts`            |
| Audit engine      | _Day 2_ — sort/dedupe behaviour, total savings math            | `src/core/audit/engine.test.ts`             |
| Summary fallback  | _Day 3_ — fallback returns coherent text on LLM failure        | `src/core/summary/fallback.test.ts`         |

Target: **≥5 audit-engine tests** (assignment minimum). Current plan ships 8.

## What is _not_ tested

- React components and pages — visual review and manual click-through
- Supabase RLS — verified by manual policy probe (insert as anon, attempt to
  read leads)
- Resend email delivery — verified by sending a real audit to a personal inbox
- LLM summary content quality — verified by reading the output across a
  handful of representative inputs

## Running

```bash
npm test            # one-shot
npm run test:watch  # repl-style
```

CI runs `npm test` on every PR and push to `main`.
