# Devlog

Chronological log of the Credex build. Each entry is what was done that day,
why, and any decisions worth remembering.

## Day 1 — 2026-05-08 — Bootstrap + catalog

**Goal:** runnable repo with the full pricing catalog and CI green.

Done:
- Next.js 15.5 + TypeScript + Tailwind v4 + ESLint scaffolded via `create-next-app`
  into a temp subdir, then files moved into the repo root (npm rejects capitalised
  package names, so the project name lives as `credex` even though the dir is `Credex`)
- `package.json` pinned to `next@^15.5` (create-next-app pulled 16.2 by default)
- shadcn/ui initialised with defaults; uses `@base-ui/react` and Tailwind v4
- Vitest 2 wired with `@/*` path alias matching `tsconfig.json`
- Prettier with `prettier-plugin-tailwindcss`; ESLint extended with prettier compat
- `src/lib/env.ts` — lazy Zod-validated env getter (server + client schemas)
- `src/core/catalog/` — types + 8 tool files + index + sanity test
  (5 tests passing: required tools present, unique IDs, unique plan IDs,
  pricing source format, plan/usage shape correctness)
- `supabase/migrations/001_init.sql` — `leads` + `audits` schema with RLS
- `.github/workflows/ci.yml` — typecheck / lint / test / build on every PR
- All 12 required markdown placeholders + `.env.example`

Decisions:
- **npm, not pnpm** — corepack on Windows requires admin to write into
  `C:\Program Files\nodejs`; npm is bundled and adequate at this scope.
- **Lazy env parsing** — `serverEnv()` / `clientEnv()` are functions, not
  module-load constants. Avoids crashing the build on missing keys before
  any env-dependent code is wired up (Day 3).
- **Catalog excludes Enterprise tiers** — custom pricing has no comparable
  anchor; the form will accept "Enterprise" as a free-text option but the
  engine simply won't score it. Honest > fabricated.
- **Pricing verified-as-of dates** — every tool carries a `pricingVerifiedAt`
  ISO string. `PRICING_DATA.md` is the spot-check checklist.

Open / for Day 2:
- Audit engine types + rules + tests (≥5; targeting 8)

## Day 1.5 — 2026-05-08 — Pricing verification pass

**Goal:** confirm catalog pricing against live vendor pages before building
the audit engine. Pricing accuracy is the assignment's spot-check trap.

Done:
- WebFetch'd all 8 vendor pricing pages.
- 5 tools verified live and corrected against the source:
  - **Claude**: Team prices dropped ($30/$25 → $25/$20), `maxSeats: 150`
    added, Team Premium seat ($125/$100) added; Max 20× dropped (live
    page wording ambiguous).
  - **Anthropic API**: 8 new model entries (Opus 4.7/4.6/4.5/4.1, Sonnet 4.6/4.5,
    Haiku 3.5/3) — Opus 4.5+ is 3× cheaper than Opus 4 and matters for the
    `cheaper-model` rule.
  - **Cursor**: `cursor-business` renamed to `cursor-teams`; Pro+ ($60) and
    Ultra ($200) added.
  - **Gemini**: Plus ($7.99/mo) added; source URL switched from
    `one.google.com` (returned INR) to `gemini.google/subscriptions/?hl=en`.
  - **Windsurf**: Pro $15 → $20, Teams $35 → $40, Pro Ultimate and Teams
    Ultimate removed; Max ($200) added; Light tier omitted (price unclear).
- 1 tool partially verified:
  - **GitHub Copilot**: individual tiers (Free / Pro / Pro+) confirmed;
    Pro annual price ($8.33) removed for honesty; Business / Enterprise
    pending separate URL verification. Page also shows ongoing
    billing-system transition.
- 2 tools UNVERIFIED — flagged honestly:
  - **ChatGPT** and **OpenAI API**: WebFetch returned 403 Forbidden against
    every OpenAI URL attempted. Catalog values left intact (training-data
    baseline) with explicit `pricingNote: "UNVERIFIED on 2026-05-08…"` on
    each. PRICING_DATA.md flags both as requiring manual verification
    before any demo.
- PRICING_DATA.md restructured with verification log, verified vs unverified
  sections, risky-assumption table, and out-of-MVP-scope pricing dimensions
  list (Anthropic 1-hr cache, data residency, Fast mode, web search, etc).
- All 5 catalog sanity tests still pass after corrections.

Decisions:
- **Honesty over completeness.** Where live pages were unclear (Claude Max 20×,
  Windsurf "Light"), the plan was OMITTED rather than guessed. Where pages
  were unreachable (OpenAI), values were left in place but flagged loudly.
- **`pricingVerifiedAt` not silently bumped** for unverified tools. ChatGPT
  and OpenAI API keep their Day-1 date but carry a `pricingNote` saying the
  2026-05-08 pass could not confirm them.

## Day 2 — pending

## Day 3 — pending

## Day 4 — pending

## Day 5 — pending
