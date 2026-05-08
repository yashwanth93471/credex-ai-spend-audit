import type { Tool } from "../types";

/**
 * Cursor (AI-first IDE).
 * Source: https://cursor.com/pricing
 *
 * Excluded: Enterprise (custom pricing).
 *
 * Verification (2026-05-08):
 *   - "Business" tier renamed to "Teams" (still $40/user/mo) — fixed.
 *   - "Pro+" added at $60/mo (3× Pro usage) — added.
 *   - "Ultra" added at $200/mo (20× Pro usage) — added.
 *   - "Hobby" and "Pro" prices unchanged.
 */
export const cursor: Tool = {
  id: "cursor",
  name: "Cursor",
  vendor: "Anysphere",
  category: "code-assistant",
  pricingModel: "subscription",
  pricingSource: "https://cursor.com/pricing",
  pricingVerifiedAt: "2026-05-08",
  plans: [
    {
      id: "cursor-hobby",
      name: "Hobby",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "Free tier with limited completions/requests.",
    },
    {
      id: "cursor-pro",
      name: "Pro",
      pricePerSeatMonthlyUsd: 20,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
    },
    {
      id: "cursor-pro-plus",
      name: "Pro+",
      pricePerSeatMonthlyUsd: 60,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "3× Pro usage limits.",
    },
    {
      id: "cursor-ultra",
      name: "Ultra",
      pricePerSeatMonthlyUsd: 200,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "20× Pro usage limits; heavy single-user.",
    },
    {
      id: "cursor-teams",
      name: "Teams",
      pricePerSeatMonthlyUsd: 40,
      minSeats: 2,
      bestForTeamSize: { min: 2, max: 100 },
      bestForUseCases: ["coding"],
      notes: "Org-wide privacy mode, SSO, admin controls. Replaces former 'Business' tier.",
    },
  ],
  alternatives: [
    { toolId: "github-copilot", reason: "Cheaper for individuals at $10/mo (Pro)." },
    { toolId: "windsurf", reason: "Comparable AI IDE at the same Pro entry price." },
  ],
  overlapsWith: ["github-copilot", "windsurf"],
};
