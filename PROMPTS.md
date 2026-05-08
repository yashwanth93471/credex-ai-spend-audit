# Prompts

How the AI summary on the audit report is generated.

> Day 1 placeholder — this file is finalised on Day 3 once the summary
> generator lands. Below is the contract the implementation will follow.

## Model

- **Anthropic Claude Haiku 4.5**
- `max_tokens: 500`
- `temperature: 0.4`
- 8-second client-side timeout

**Why Haiku:** the summary is a 200-word grounded narrative — exactly the
canonical Haiku use case. ~10× cheaper and ~3× faster than Sonnet/Opus, with
indistinguishable quality at this length.

## System prompt

_To be inserted verbatim from `src/core/summary/prompts.ts` once written._
Outline:

- Persona: senior SaaS cost advisor at Credex
- Output rules: 2–3 short paragraphs, plain prose, no markdown / bullets / code
- Voice: 2nd person ("you"), direct, no hedging, no emojis
- Grounding: only reference numbers present in the JSON; never invent numbers
- No promises about specific vendor decisions ("this is the best plan")

## User prompt

JSON facts payload:

```json
{
  "totalSpend": 0,
  "totalSavings": 0,
  "savingsPct": 0,
  "teamSize": 0,
  "useCase": "string",
  "findings": [
    { "title": "string", "savings": 0, "recommendation": "string" }
  ]
}
```

Closing instruction: `"Write the summary now."`

## Fallback

If the API call fails for any reason (timeout, missing key, parse error,
rate limit), `core/summary/fallback.ts` returns a deterministic
template-rendered summary. Templates are keyed by the top finding category
and always include the headline savings number. The audit row records
`summary_source: 'fallback'` so we can monitor failure rate.

## Cost estimate

At Haiku rates (~$1 / 1M input, $5 / 1M output) and a typical audit payload
of ~500 tokens in / ~250 tokens out:

- Per audit: ≈ $0.0005 input + $0.00125 output ≈ **$0.0018**
- 1,000 audits: **~$1.80**

Well below any plausible per-lead cost ceiling.

## Worked examples

_Three input → output pairs added on Day 3 once the prompt is finalised._
