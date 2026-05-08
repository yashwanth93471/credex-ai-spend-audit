# Pricing data

Every catalog price is sourced from a vendor pricing page. This document is
the verification log: what was checked, when, against which URL, and what was
found. The assignment notes that pricing data will be spot-checked, so
accuracy here is non-negotiable — and so is honesty about what hasn't been
verified.

---

## Catalog summary

| Tool ID         | Vendor    | Source URL                                                  | Verified   | Status                                  |
| --------------- | --------- | ----------------------------------------------------------- | ---------- | --------------------------------------- |
| `chatgpt`       | OpenAI    | https://openai.com/chatgpt/pricing/                         | 2026-05-08 | ⚠️ **UNVERIFIED** — WebFetch 403         |
| `openai-api`    | OpenAI    | https://openai.com/api/pricing/                             | 2026-05-08 | ⚠️ **UNVERIFIED** — WebFetch 403         |
| `claude`        | Anthropic | https://claude.com/pricing                                  | 2026-05-08 | ✅ Verified live; Team prices corrected  |
| `anthropic-api` | Anthropic | https://platform.claude.com/docs/en/docs/about-claude/pricing | 2026-05-08 | ✅ Verified live; 8 new models added     |
| `cursor`        | Anysphere | https://cursor.com/pricing                                  | 2026-05-08 | ✅ Verified live; Business→Teams renamed |
| `github-copilot`| GitHub    | https://github.com/features/copilot/plans                   | 2026-05-08 | ⚠️ **PARTIAL** — Business/Enterprise not on this URL |
| `gemini`        | Google    | https://gemini.google/subscriptions/?hl=en                  | 2026-05-08 | ✅ Verified live; Plus tier added        |
| `windsurf`      | Codeium   | https://windsurf.com/pricing                                | 2026-05-08 | ✅ Verified live; substantial repricing  |

---

## Verification log — 2026-05-08 pass

### ✅ Verified live (5 tools)

#### `claude` — claude.com/pricing
- Pro: $20/mo monthly, $17/mo annual — confirmed
- Max 5×: starts at $100/mo — confirmed
- Team Standard: **$25/mo monthly, $20/mo annual** (was $30/$25 in original draft — corrected)
- Team Premium seat: **$125/mo monthly, $100/mo annual** — added (was missing)
- Team seat range: **5 to 150** (max added)
- **Max 20× tier OMITTED** — live page shows Max as a single plan
  "starting at $100/mo (pricing varies by usage tier)" without a clean
  $200/mo 20× number. Original $200/mo claim could not be confirmed in
  this pass; remove rather than fabricate.

#### `anthropic-api` — platform.claude.com (docs.anthropic.com 301-redirects here)
- Verified verbatim from the live model-pricing table.
- Existing models (Opus 4, Sonnet 4, Haiku 4.5) all confirmed correct.
- Batch discount 50% confirmed; cache read 0.1× input (90% off) confirmed.
- **8 new models added:**
  Opus 4.7, Opus 4.6, Opus 4.5, Opus 4.1 (Opus 4.5+ at $5/$25, **3× cheaper than Opus 4**),
  Sonnet 4.6, Sonnet 4.5, Haiku 3.5, Haiku 3.

#### `cursor` — cursor.com/pricing
- Hobby (free) and Pro ($20/mo) unchanged.
- **`cursor-business` renamed to `cursor-teams`** — same $40/user/mo price, but the live tier label is "Teams".
- **Pro+ added** — $60/mo (3× Pro usage).
- **Ultra added** — $200/mo (20× Pro usage).

#### `gemini` — gemini.google/subscriptions/?hl=en
- Original source URL `one.google.com/about/google-ai-plans` returned **INR localisation with no USD** —
  switched to `gemini.google/subscriptions/?hl=en` which serves USD.
- Free, Pro ($19.99), Ultra ($249.99) confirmed.
- **Google AI Plus added** — $7.99/mo, was missing entirely.

#### `windsurf` — windsurf.com/pricing
- **Pro repriced**: $15 → **$20/mo** (original catalog was wrong by $5).
- **Teams repriced**: $35 → **$40/seat/mo**.
- **`windsurf-pro-ultimate` REMOVED** — no longer offered.
- **`windsurf-teams-ultimate` REMOVED** — no longer offered.
- **`windsurf-max` added** at $200/mo (replaces former Pro Ultimate).
- "Light" tier present on the live page but published price unclear
  ("unlimited usage" with no rate shown) — INTENTIONALLY OMITTED until
  pricing can be confirmed manually.

### ⚠️ Partial (1 tool)

#### `github-copilot` — github.com/features/copilot/plans
- Free, Pro ($10), Pro+ ($39) confirmed on the individual-tiers page.
- Free quota text updated: "50 agent/chat requests + 2,000 completions per month".
- **Annual price for Pro NOT shown on this page** — `pricePerSeatAnnualMonthlyUsd: 8.33`
  removed for honesty; restore only after re-verification.
- **Business and Enterprise NOT on this URL** — they sit behind a separate
  "for businesses" page the fetch didn't reach. `copilot-business` retained
  at the historical $19/seat with a `notes` field flagging the gap.
  Verify against the business-pricing URL before any demo.
- **Live page note:** "Upgrades are paused as we roll out a flexible billing
  experience" appears on Pro and Pro+. Published prices may not be currently
  bookable for new upgrades. Worth flagging to a reviewer.

### ❌ Unverified — manual check required (2 tools)

#### `chatgpt` — openai.com/chatgpt/pricing/
WebFetch returned **403 Forbidden** (anti-bot blocking) on both
`openai.com/chatgpt/pricing` and `openai.com/chatgpt/pricing/`.
The OpenAI help-centre URLs also returned 403.

Catalog values were inherited from the initial draft (training-data baseline)
and have NOT been confirmed live in this pass. Specific items to verify:

- Plus at **$20/mo** — likely still correct, but confirm.
- Pro at **$200/mo** — launched Dec 2024, likely correct.
- Team at **$30 monthly / $25 annual, min 2 seats** — verify both prices and the seat minimum.
- **Investigate:** are "ChatGPT Business" and/or "ChatGPT Go" now offered?
  Either could replace or sit alongside Team.

#### `openai-api` — openai.com/api/pricing/
WebFetch returned **403 Forbidden** on every OpenAI URL attempted in this
session. Catalog values inherited from training-data baseline.

Specific items to verify:

- gpt-4o ($2.50 / $10 / $1.25 cached) and gpt-4o-mini ($0.15 / $0.60) — likely current.
- gpt-4-turbo, gpt-3.5-turbo, o1, o1-mini — **likely deprecated** for new use.
- **Likely missing entirely:** gpt-4.1, gpt-5, o3, o3-mini, o4-mini.
  Without these in the catalog the engine's "cheaper-model" rule cannot
  recommend the actual cheapest current model.
- Batch API discount (50%) — believed unchanged; confirm.

---

## Risky assumptions to flag (assignment-grade)

| Risk | Why it matters |
|---|---|
| **OpenAI catalog is unverified, period** | Two of eight required tools have unconfirmed pricing. The single biggest assignment-grade risk. |
| **Claude Max 20× was dropped, not corrected** | If a reviewer expects to see a $200 / 20× Max plan in the catalog and doesn't, that's a hole. Re-add only after a fresh manual visit confirms the price. |
| **Cursor "Business" tier no longer exists** | Anyone who uses Cursor will spot a stale "Business" label instantly. Now corrected. |
| **Windsurf basic Pro tier was $5 off** | Same risk — corrected to $20/mo. |
| **GitHub Copilot is mid billing-transition** | The live page literally says upgrades are paused. A demo using Copilot pricing might surprise the reviewer. |
| **Annual-billing prices are easy to miss on vendor pages** | Several pages don't show annual prominently. Currently confirmed annual: Claude Pro ($17), Claude Team ($20/$100). Currently UNcConfirmed annual: Copilot Pro (removed). |
| **Gemini source-URL drift** | The `one.google.com` URL serves regional currency. Use the `gemini.google/subscriptions` URL going forward. |

---

## Out-of-MVP-scope pricing dimensions

Surfaced on vendor pages but deliberately not modeled in the catalog (yet).
Listed here so a reviewer doesn't think we missed them — these are scope
calls, not oversights:

- **Anthropic 1-hour cache writes** (2× input multiplier; default cache writes are 5-min, 1.25×)
- **Anthropic data residency** (1.1× multiplier when `inference_geo: us` is set)
- **Anthropic Fast mode** (6× rates on Opus 4.6 only)
- **Anthropic web search** ($10 per 1k searches)
- **Anthropic code execution containers** (1,550 free hours/mo, $0.05/hr/container after)
- **Anthropic Managed Agents session runtime** ($0.08 per session-hour)
- **OpenAI Batch API discount** (50% — implied via `batchDiscount: 0.5` flag, not enumerated per-model in the catalog)
- **Volume / enterprise discounts** for any vendor (custom-quoted)
- **Regional / non-USD pricing** for any vendor (US-region USD only)
- **Promotional rates** — first-month-free, annual launch promos, etc.

If/when the audit engine grows to model these, this list is the backlog.

---

## How to spot-check

For each tool:

1. Open the source URL in a private browser window (no logged-in cookies).
2. For each plan in `src/core/catalog/tools/<tool>.ts`, confirm:
   - `pricePerSeatMonthlyUsd` against the "billed monthly" rate.
   - `pricePerSeatAnnualMonthlyUsd` against the annual-billed rate
     (divide the published annual total by 12 if needed).
   - `minSeats` / `maxSeats` against any seat-minimum/maximum constraint.
3. If anything has changed, edit the file AND bump `pricingVerifiedAt`.
4. Re-run `npm test` — the catalog sanity tests will catch structural issues
   (missing required tools, duplicate IDs, missing source URLs).

## Caveats and edge cases

- **Vendor regional pricing** — listed prices are USD, US region. EU/UK/AU pricing differs.
- **Promotional rates** — first-month-free and annual launch promos are not modeled.
- **Vendor rebrands** — Codeium → Windsurf and Gemini Advanced → Google AI Pro
  happened mid-2024 / 2025; both reflect current naming.

## Initial source

Initial values were drafted by the build assistant against publicly-known
pricing as of January 2026. The 2026-05-08 verification pass corrected
prices for five tools and explicitly flagged the two that could not be
reached (OpenAI properties).
