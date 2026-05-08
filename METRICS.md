# Metrics

What Credex tracks, why, and how we read it. Numbers below describe the
funnel and the audit engine — not vanity metrics.

## North-star metric

**Captured leads per week** — the only number that matters for a lead-gen
product. Everything else is upstream of it.

## Funnel metrics

| Metric                            | Source                | Why it matters                                 |
| --------------------------------- | --------------------- | ---------------------------------------------- |
| Landing visits                    | Vercel Analytics      | Top of funnel                                  |
| Form starts                       | Page event            | Did the headline / CTA work?                   |
| Form completions                  | `audits` row created  | Did the form ask too much?                     |
| Audit views                       | Page event            | Did the redirect work? Are users reading?      |
| Email captures                    | `claimed_at` set      | The conversion that matters                    |
| Shares (link copies)              | Client event          | Viral coefficient signal                       |

## Engine metrics

| Metric                              | Source                | Why it matters                              |
| ----------------------------------- | --------------------- | ------------------------------------------- |
| Avg findings per audit              | `result.findings`     | Is the engine actually finding things?      |
| Avg savings per audit ($/mo)        | `audits.savings_usd`  | The headline number we promote              |
| % audits with $0 findings           | derived               | Is the form too narrow / catalog too small? |
| LLM-summary success rate            | `summary_source='llm'`| Catches Anthropic outages and budget hits   |
| p95 audit creation latency          | server log            | Form submit shouldn't feel slow             |

## Quality metrics

| Metric                     | How to read                                         |
| -------------------------- | --------------------------------------------------- |
| Pricing-source freshness   | Days since `pricingVerifiedAt` per tool. Keep <14.  |
| Test pass rate             | Should be 100% on `main`                            |
| Lighthouse scores          | Perf 90+, A11y 95+, BP 95+, SEO 95+ on key routes   |

## Dashboards

For an MVP, "the dashboard" is a Supabase SQL editor with five saved queries:

```sql
-- 1. funnel snapshot (last 7d)
select count(*) total, count(claimed_at) claimed
from audits where created_at > now() - interval '7 days';

-- 2. avg savings (last 7d)
select avg(savings_usd)::numeric(10,2) from audits
where created_at > now() - interval '7 days';

-- 3. summary fallback rate
select summary_source, count(*) from audits group by 1;

-- 4. zero-finding audits
select count(*) from audits where (result->>'totalMonthlySavingsUsd')::numeric = 0;

-- 5. top tools submitted
select inputs, savings_usd from audits order by created_at desc limit 50;
```

Real dashboards (Grafana / Posthog) are explicitly out of MVP scope.

## What we don't track (and why)

- **Bounces, sessions, page views per session** — vanity. We care about
  forms started and emails captured, full stop.
- **Heatmaps / session recording** — useful later; manual interviews
  give the same signal cheaper this week.
- **A/B test data** — no traffic to A/B yet; the assumption is qualitative.
