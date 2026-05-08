import type { Tool } from "../types";

/**
 * Anthropic API (Claude developer / pay-as-you-go).
 * Source: https://platform.claude.com/docs/en/docs/about-claude/pricing
 *   (docs.anthropic.com 301-redirects to platform.claude.com)
 *
 * Verified verbatim from the live pricing table on 2026-05-08.
 *
 * Newer Opus tiers (4.5/4.6/4.7) are 3× cheaper than Opus 4 — the engine should
 * recommend upgrading to these when it sees Opus 4 usage. Older Haiku tiers
 * (3, 3.5) are cheaper than Haiku 4.5 for low-complexity workloads.
 *
 * Out-of-scope pricing dimensions surfaced on the page (NOT modeled here):
 *   - 1-hour cache writes (2× input multiplier)
 *   - Data residency multiplier (1.1× for inference_geo: us)
 *   - Fast mode (6× rates on Opus 4.6 only)
 *   - Web search ($10 / 1k searches)
 *   - Code execution containers (1,550 free hr/mo, then $0.05/hr)
 * See PRICING_DATA.md for the full list and rationale.
 */
export const anthropicApi: Tool = {
  id: "anthropic-api",
  name: "Anthropic API",
  vendor: "Anthropic",
  category: "developer-api",
  pricingModel: "usage",
  pricingSource: "https://platform.claude.com/docs/en/docs/about-claude/pricing",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "Rates per 1M tokens, USD. Batch API: 50% discount. Cache read: 0.1× input (90% off).",
  plans: [],
  usageRates: {
    promptCachingSupported: true,
    batchDiscount: 0.5,
    models: [
      // Opus family — newest (4.5+) repriced 3× cheaper than 4 / 4.1
      {
        id: "claude-opus-4-7",
        name: "Claude Opus 4.7",
        inputPer1M: 5,
        outputPer1M: 25,
        cachedInputPer1M: 0.5,
        notes: "Latest Opus; new tokenizer (~35% more tokens for same text).",
      },
      {
        id: "claude-opus-4-6",
        name: "Claude Opus 4.6",
        inputPer1M: 5,
        outputPer1M: 25,
        cachedInputPer1M: 0.5,
      },
      {
        id: "claude-opus-4-5",
        name: "Claude Opus 4.5",
        inputPer1M: 5,
        outputPer1M: 25,
        cachedInputPer1M: 0.5,
      },
      {
        id: "claude-opus-4-1",
        name: "Claude Opus 4.1",
        inputPer1M: 15,
        outputPer1M: 75,
        cachedInputPer1M: 1.5,
      },
      {
        id: "claude-opus-4",
        name: "Claude Opus 4",
        inputPer1M: 15,
        outputPer1M: 75,
        cachedInputPer1M: 1.5,
      },
      // Sonnet family
      {
        id: "claude-sonnet-4-6",
        name: "Claude Sonnet 4.6",
        inputPer1M: 3,
        outputPer1M: 15,
        cachedInputPer1M: 0.3,
      },
      {
        id: "claude-sonnet-4-5",
        name: "Claude Sonnet 4.5",
        inputPer1M: 3,
        outputPer1M: 15,
        cachedInputPer1M: 0.3,
      },
      {
        id: "claude-sonnet-4",
        name: "Claude Sonnet 4",
        inputPer1M: 3,
        outputPer1M: 15,
        cachedInputPer1M: 0.3,
      },
      // Haiku family — 3 and 3.5 cheaper than 4.5 for simple tasks
      {
        id: "claude-haiku-4-5",
        name: "Claude Haiku 4.5",
        inputPer1M: 1,
        outputPer1M: 5,
        cachedInputPer1M: 0.1,
      },
      {
        id: "claude-haiku-3-5",
        name: "Claude Haiku 3.5",
        inputPer1M: 0.8,
        outputPer1M: 4,
        cachedInputPer1M: 0.08,
      },
      {
        id: "claude-haiku-3",
        name: "Claude Haiku 3",
        inputPer1M: 0.25,
        outputPer1M: 1.25,
        cachedInputPer1M: 0.03,
        notes: "Cheapest Claude — fits high-volume low-complexity workloads.",
      },
    ],
  },
  alternatives: [
    {
      toolId: "openai-api",
      reason: "Comparable general-purpose API; pricing competitive at most tiers.",
    },
  ],
  overlapsWith: ["openai-api"],
  creditPrograms: [
    {
      type: "startup",
      description: "Anthropic for Startups — API credits for early-stage companies.",
      url: "https://www.anthropic.com/startups",
    },
  ],
};
