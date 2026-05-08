import type { Tool } from "../types";

/**
 * OpenAI API (developer / pay-as-you-go).
 * Source: https://openai.com/api/pricing/
 *
 * **UNVERIFIED on 2026-05-08:** Both `openai.com/api/pricing/` and
 * `platform.openai.com/docs/pricing` returned 403 Forbidden against WebFetch.
 * Values below are inherited from the initial draft (training-data baseline).
 *
 * Likely missing models the audit engine would benefit from when verified:
 *   gpt-4.1, gpt-5, o3, o3-mini, o4-mini.
 * Likely-deprecated models still listed: gpt-4-turbo, gpt-3.5-turbo, o1, o1-mini.
 *
 * Per-1M-token rates for the most commonly billed models. Older / niche models
 * (Whisper, embeddings, fine-tuned variants) are intentionally excluded.
 */
export const openaiApi: Tool = {
  id: "openai-api",
  name: "OpenAI API",
  vendor: "OpenAI",
  category: "developer-api",
  pricingModel: "usage",
  pricingSource: "https://openai.com/api/pricing/",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "UNVERIFIED on 2026-05-08 (WebFetch 403). Rates per 1M tokens, USD; batch API 50% discount believed unchanged. Manual verification pending.",
  plans: [],
  usageRates: {
    promptCachingSupported: true,
    batchDiscount: 0.5,
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        inputPer1M: 2.5,
        outputPer1M: 10,
        cachedInputPer1M: 1.25,
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o mini",
        inputPer1M: 0.15,
        outputPer1M: 0.6,
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo (legacy)",
        inputPer1M: 10,
        outputPer1M: 30,
        notes: "Legacy — prefer GPT-4o for new workloads.",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo (legacy)",
        inputPer1M: 0.5,
        outputPer1M: 1.5,
        notes: "Legacy — GPT-4o mini is cheaper and stronger.",
      },
      {
        id: "o1",
        name: "o1",
        inputPer1M: 15,
        outputPer1M: 60,
      },
      {
        id: "o1-mini",
        name: "o1-mini",
        inputPer1M: 3,
        outputPer1M: 12,
      },
    ],
  },
  alternatives: [
    {
      toolId: "anthropic-api",
      reason: "Often cheaper for long-context tasks with prompt caching enabled.",
    },
  ],
  overlapsWith: ["anthropic-api"],
  creditPrograms: [
    {
      type: "startup",
      description: "OpenAI for Startups — API credits up to $250K (Y Combinator and select accelerators).",
      url: "https://openai.com/forms/openai-startups/",
    },
  ],
};
