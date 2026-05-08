import type { Tool } from "../types";

/**
 * Windsurf (Codeium — AI IDE).
 * Source: https://windsurf.com/pricing
 *
 * Excluded: Enterprise (custom pricing).
 *
 * Verification (2026-05-08) — substantial repricing since original catalog:
 *   - Pro: $15/mo  →  $20/mo
 *   - Teams: $35/seat  →  $40/seat
 *   - "Pro Ultimate" ($60/mo) — REMOVED, no longer offered.
 *   - "Teams Ultimate" ($90/seat) — REMOVED, no longer offered.
 *   - "Max" tier added at $200/mo (replaces former Pro Ultimate).
 *   - "Light" tier present on the page but published price unclear
 *     ("unlimited usage" with no rate shown) — INTENTIONALLY OMITTED until
 *     pricing can be verified manually.
 */
export const windsurf: Tool = {
  id: "windsurf",
  name: "Windsurf",
  vendor: "Codeium",
  category: "code-assistant",
  pricingModel: "subscription",
  pricingSource: "https://windsurf.com/pricing",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "Repricing pass 2026-05-08. 'Light' tier omitted pending price clarity.",
  plans: [
    {
      id: "windsurf-free",
      name: "Free",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "Limited credits per month.",
    },
    {
      id: "windsurf-pro",
      name: "Pro",
      pricePerSeatMonthlyUsd: 20,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
    },
    {
      id: "windsurf-max",
      name: "Max",
      pricePerSeatMonthlyUsd: 200,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "Highest individual tier; replaces former Pro Ultimate.",
    },
    {
      id: "windsurf-teams",
      name: "Teams",
      pricePerSeatMonthlyUsd: 40,
      minSeats: 2,
      bestForTeamSize: { min: 2, max: 100 },
      bestForUseCases: ["coding"],
    },
  ],
  alternatives: [
    { toolId: "cursor", reason: "Stronger agent / multi-file editing capabilities at the same price tier." },
    { toolId: "github-copilot", reason: "Cheapest individual option at $10/mo; integrates natively with GitHub." },
  ],
  overlapsWith: ["cursor", "github-copilot"],
};
