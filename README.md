# Credex

AI SaaS spend audit + lead-gen tool. Users describe their AI tool stack (plans, seats, monthly spend, team size, primary use case) and Credex returns a personalised report of plan-optimisation, seat-rightsizing, alternative-tool and credit-program findings — with an AI-generated narrative summary.

> Internship assignment, 5-day MVP. Designed strictly to the assignment PDF.

## Stack

- **Next.js 15** (App Router) — TypeScript, Tailwind v4, shadcn/ui
- **Supabase** — Postgres + RLS for `leads` and `audits`
- **Anthropic Claude Haiku** — AI-powered audit summaries with deterministic fallback
- **Resend** — Transactional report emails
- **Vitest** — Unit tests for the audit engine and catalog
- **Zod** — Environment and form validation
- **GitHub Actions** — CI (typecheck / lint / test / build) on every PR

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Fill in required values:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_APP_URL
# Optional: ANTHROPIC_API_KEY (for AI summaries)
# Optional: RESEND_API_KEY (for email)

# Start development server
npm run dev
```

The dev server boots on `http://localhost:3000`.

### Without Environment Variables

The catalog, types, and tests compile and pass without any environment variables. Runtime crashes only occur when an env-dependent code path executes (Day 3 onward).

## Scripts

| Command              | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Next.js dev server (Turbopack)                  |
| `npm run build`      | Production build                             |
| `npm start`          | Start production server                      |
| `npm test`           | Run all Vitest suites once                   |
| `npm run test:watch` | Re-run tests on change                         |
| `npm run typecheck`  | TypeScript type checking                      |
| `npm run lint`       | ESLint with Next + Prettier                  |
| `npm run format`     | Prettier code formatting                     |

## Architecture

```
src/
  app/                      Routes (RSC, route handlers, layouts)
    api/                    API routes (POST /api/audit)
    audit/                  Form and report pages
      [id]/                Dynamic report page
  core/                     Pure domain — no Next, no I/O, no React
    audit/                  Engine + rules + types
    catalog/                Tool knowledge base
    summary/                AI summary generation + fallback
  components/ui/            shadcn primitives + custom UI
    loading/              Loading spinners and states
    error-state/          Error and empty state components
  actions/                  Server actions (claim audit)
  lib/                      Framework-coupled infrastructure
    env.ts                Environment validation
    supabase.ts           Supabase clients + types
    email/resend.ts       Email sending
supabase/migrations/        Versioned SQL schema
.github/workflows/ci.yml    CI/CD pipeline
```

The hard rule: nothing inside `core/` imports from `app/`, `features/`, `components/`, or `lib`. Dependencies point one way.

## Environment Variables

### Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side write access | `eyJh...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side read access | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous read key | `eyJh...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL for OG links | `http://localhost:3000` |

### Optional

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | AI summary generation | `sk-ant-...` |
| `RESEND_API_KEY` | Email sending | `re_...` |
| `RESEND_FROM_EMAIL` | From email for reports | `audits@credex.example` |

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts to connect your repo and configure environment variables.

### Environment Variable Setup

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add all required variables from `.env.example`
4. For Anthropic API Key and Resend API Key, add only if you have them
5. Redeploy to apply changes

### Post-Deployment Verification

1. Visit the deployed URL
2. Run a full audit and verify:
   - Form submits successfully
   - Report renders correctly
   - Email capture works (if API keys provided)
   - OG images generate on share

### Known Deployment Considerations

- **Serverless Functions**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not the anon key)
- **API Routes**: `/api/audit` handles CORS for same-origin requests
- **Database**: Ensure Supabase project has the migrations applied (`supabase/migrations/001_init.sql`)

## Database Setup

1. Create a new Supabase project
2. Run the migration from `supabase/migrations/001_init.sql` in the Supabase SQL editor
3. Configure Row Level Security (RLS) policies are included in the migration
4. Set up your environment variables with the project URL and keys

## Testing

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Current test coverage:
- Catalog sanity: 5 tests
- Audit engine: 4 tests  
- Audit rules: 12 tests (2 per rule)
- **Total: 21 tests passing**

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

## Known Limitations

1. **Unverified Pricing**: ChatGPT and OpenAI API pricing could not be verified (403 Forbidden). See `PRICING_DATA.md` for details.
2. **No Authentication**: The product uses anonymous access for audits. Leads are created via email claim.
3. **AI Summary Without Key**: If `ANTHROPIC_API_KEY` is not set, summaries use a deterministic fallback template.
4. **Email Without Key**: If `RESEND_API_KEY` is not set, the email send step fails silently (product still works).
5. **Single User at a Time**: The audit flow is not designed for concurrent audits by the same user.
6. **No Account Management**: Users cannot view past audits or manage settings.
7. **Limited Tool Catalog**: Only 8 tools are supported. Adding more requires updating the catalog schema.

## How It Works

1. **User submits audit form** with their AI tool stack, team size, and spend
2. **Audit engine analyzes** the input against the tool catalog using 6 deterministic rules:
   - Overpriced plan detection
   - Excess seat identification
   - Overlapping tool detection
   - Cheaper alternative suggestions
   - Annual discount opportunities
   - Startup credit eligibility
3. **Findings are generated** with evidence, severity, and estimated savings
4. **AI summary** (optional) provides a narrative explanation of the findings
5. **Report is generated** and persisted to Supabase
6. **User can claim the audit** by providing email (value before signup)
7. **Confirmation email** is sent (optional) with the report link

## Deterministic Architecture

The audit engine is pure functional and deterministic:
- Same input + same catalog → same output (always)
- Evidence is mandatory on every finding
- No AI hallucination in recommendations
- AI is used ONLY for summarization, not for financial advice
- Fallback ensures the product works even without AI

## Git History

The project was built incrementally over 5 days:

```
Day 1: Infrastructure + catalog + docs
Day 2: Deterministic audit engine (6 rules, 21 tests)
Day 3: Audit form + API + report + landing page
Day 4: AI summary + email capture + Resend + OG images
Day 5: UX polish + documentation + final cleanup
```

## License

Internship assignment — not licensed for redistribution.
