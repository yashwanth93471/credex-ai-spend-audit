# Credex

AI SaaS spend audit + lead-gen tool. Users describe their AI tool stack
(plans, seats, monthly spend, team size, primary use case) and Credex returns
a personalised report of plan-optimisation, seat-rightsizing, alternative-tool
and credit-program findings — with an AI-generated narrative summary.

> Internship assignment, 5-day MVP. Designed strictly to the assignment PDF.

## Stack

- **Next.js 15** (App Router) — TypeScript, Tailwind v4, shadcn/ui
- **Supabase** — Postgres + RLS for `leads` and `audits`
- **Anthropic Claude** — personalised summary (Haiku); deterministic fallback
- **Resend** — transactional report email
- **Vitest** — unit tests for the audit engine and catalog
- **Zod** — env + form validation
- **GitHub Actions** — typecheck / lint / test / build on every PR

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in Supabase + (optionally) Anthropic / Resend
npm run dev
```

The dev server boots on `http://localhost:3000`. With no env values supplied,
the catalog and types compile and tests pass — runtime crashes only when an
env-dependent code path executes (Day 3 onward).

## Scripts

| Command              | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Next dev server (Turbopack)                  |
| `npm run build`      | Production build                             |
| `npm test`           | Run all Vitest suites once                   |
| `npm run test:watch` | Re-run on change                             |
| `npm run typecheck`  | `tsc --noEmit`                               |
| `npm run lint`       | ESLint with Next + Prettier configs          |
| `npm run format`     | Prettier write                               |

## Repository map

```
src/
  app/                      Routes (RSC, route handlers, layouts)
  core/                     Pure domain — no Next, no I/O
    audit/                  Engine + rules + types  (Day 2)
    catalog/                Tool knowledge base
  features/                 Vertical slices (form, report)  (Day 3+)
  components/ui/            shadcn primitives
  lib/                      Framework-coupled infra (env, clients)
supabase/migrations/        Versioned SQL
.github/workflows/ci.yml    CI
```

## Documentation

| File                 | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `ARCHITECTURE.md`    | Folder-structure rationale, audit engine design |
| `DEVLOG.md`          | Daily build log                                 |
| `REFLECTION.md`      | Post-build retrospective                        |
| `TESTS.md`           | Test coverage rationale                         |
| `PRICING_DATA.md`    | Vendor pricing sources + verification log       |
| `PROMPTS.md`         | LLM prompt architecture + fallback              |
| `GTM.md`             | Go-to-market strategy                           |
| `ECONOMICS.md`       | Unit economics                                  |
| `USER_INTERVIEWS.md` | Customer-discovery notes                        |
| `LANDING_COPY.md`    | Landing-page copy + variants                    |
| `METRICS.md`         | What we track and why                           |

## License

Internship assignment — not licensed for redistribution.
