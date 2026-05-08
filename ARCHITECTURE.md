# Architecture

## Mental model (one paragraph)

A user fills a public form (no email) → server action validates with Zod →
`runAudit(input, catalog)` returns a pure-function `AuditResult` → an LLM
summary is generated (Anthropic Haiku, with deterministic fallback) → the
audit row is persisted to Supabase with `lead_id = NULL` → user is redirected
to `/audit/[id]`. The report is fully visible without auth or email. An email
capture block at the bottom of the report upgrades the audit to a tracked
lead and triggers a Resend email.

**Email is captured AFTER value is shown — never before.** This is the
load-bearing UX rule from the assignment PDF.

## Folder structure

```
src/
  app/                    Routes only (Next 15 App Router)
    page.tsx              Landing
    audit/page.tsx        Form
    audit/[id]/page.tsx   Public report (shareable)
  core/                   Pure domain — no Next, no I/O, no React
    audit/                Engine + rule pipeline
    catalog/              SaaS tool catalog (TS, not DB)
  features/               Vertical slices (UI + actions per concern)
  components/ui/          shadcn primitives
  lib/                    env, supabase clients, resend, anthropic client
supabase/migrations/      Versioned SQL
```

The hard rule: nothing inside `core/` imports anything from `app/`,
`features/`, `components/`, or `lib/`. Dependencies point one way.

## Audit engine

Six rules, each in its own file under `core/audit/rules/`:

| Rule                | What it flags                                          |
| ------------------- | ------------------------------------------------------ |
| `overpriced-plan`   | Cheaper plan would cover stated team size + use case   |
| `excess-seats`      | Seat count exceeds team size by >20%                   |
| `overlapping-tools` | Two subscriptions in overlapping categories            |
| `cheaper-alternative`| Catalog lists a comparable tool at lower cost         |
| `annual-discount`   | Monthly billing where annual would save                |
| `credit-program`    | User likely qualifies for startup/student/OSS credits  |

Each rule is a pure function `(input, catalog) => Finding | null`. The
engine maps over the registry, drops nulls, sorts by `estimatedMonthlySavingsUsd` desc.

Every Finding carries mandatory `evidence` (observed metric + which input
fields supported the conclusion). No speculation — auditors must show their work.

## Database

Two tables, RLS enabled. See `supabase/migrations/001_init.sql`.

- `leads` (deduped by email; no anon access)
- `audits` (jsonb `inputs` + `result`, `summary` + `summary_source`,
  `lead_id` NULLABLE, anon-readable for shareable links)

`engine_version` is recorded per audit so old reports stay reproducible
even after rules change.

## AI summary

`core/summary/generate.ts` calls Anthropic Claude Haiku with a structured
JSON user prompt and a tightly-scoped system prompt. On any failure
(timeout, missing key, parse error) it falls back to deterministic templates.
Every audit gets *some* summary; no degraded-state UI. The `summary_source`
flag (`'llm' | 'fallback'`) is stored alongside.

See `PROMPTS.md` for the verbatim prompts.
