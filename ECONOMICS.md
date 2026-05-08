# Unit economics

> Day 1 placeholder. Numbers below are hypothesis, not measurement.

## Per-audit cost (cost of goods sold)

| Component                    | Per audit       |
| ---------------------------- | --------------: |
| Anthropic Haiku summary call | ~$0.0018        |
| Supabase row + index storage | ~$0.0001        |
| Resend email (when claimed)  | ~$0.0004        |
| Vercel function invocation   | ~$0.0001        |
| **Total**                    | **~$0.0024**    |

At 1,000 audits/mo: **~$2.40 of variable cost.**

## Per-lead value (assumed)

A captured lead is the unit. The product is currently lead-gen for Credex
(no SKU sold yet). Value rests on:

- Conversion to a Credex sales conversation (small %, high $)
- Or, future direct monetisation: paid plans, partner referrals, etc.

For modeling, assume:

- Email-claim rate: **35%** of completed audits → leads
- Sales-qualified rate: **10%** of leads → SQL
- Close rate (hypothetical): **15%** of SQLs → closed-won
- ACV (hypothetical): **$1,200** annual

Per-audit expected value (uncalibrated): `0.35 × 0.10 × 0.15 × $1,200 ≈ $6.30`.

Versus per-audit cost of $0.0024, the gross margin is functionally 100% at
small scale. The constraint is acquisition, not COGS.

## Key sensitivities

- **Email-claim rate** — biggest lever. Email-after-value flow optimised
  for this; landing copy and CTA wording are the remaining knobs.
- **Audit accuracy** — a single wrong-pricing finding kills trust and the
  email capture along with it. See `PRICING_DATA.md`.
- **Summary quality** — fallback templates must read as well as the LLM
  output, or our cost ceiling is the LLM uptime.

## What I'm watching

`METRICS.md` lists the dashboard. Day 5 retrospective will compare actuals
(if any) to these assumptions.
