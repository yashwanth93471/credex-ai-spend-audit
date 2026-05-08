import type { Tool } from "../types";

/**
 * GitHub Copilot.
 * Source: https://github.com/features/copilot/plans
 *
 * Excluded: Enterprise (custom pricing).
 *
 * Verification (2026-05-08) — PARTIAL:
 *   - Free / Pro / Pro+ confirmed on the live page.
 *   - Free quota: "50 agent or chat requests/mo, 2,000 completions/mo".
 *   - The page currently shows: "Upgrades are paused as we roll out a
 *     flexible billing experience" on Pro and Pro+. Published prices may
 *     not be currently bookable for new upgrades. Worth flagging to user.
 *   - Annual pricing for Pro NOT shown on the verified page —
 *     `pricePerSeatAnnualMonthlyUsd` removed for honesty.
 *   - Business ($19/seat) and Enterprise ($39/seat) NOT shown on this URL —
 *     they sit behind a separate "for businesses" tab/page that the fetch
 *     didn't reach. Business retained at the historical $19 with a note;
 *     verify against a business-pricing URL before any demo.
 */
export const githubCopilot: Tool = {
  id: "github-copilot",
  name: "GitHub Copilot",
  vendor: "GitHub (Microsoft)",
  category: "code-assistant",
  pricingModel: "subscription",
  pricingSource: "https://github.com/features/copilot/plans",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "Individual tiers verified. Business/Enterprise pending separate verification. Page shows ongoing billing-system transition.",
  plans: [
    {
      id: "copilot-free",
      name: "Free",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "50 agent/chat requests + 2,000 completions per month.",
    },
    {
      id: "copilot-pro",
      name: "Pro",
      pricePerSeatMonthlyUsd: 10,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "Annual pricing NOT shown on live individual-tier page.",
    },
    {
      id: "copilot-pro-plus",
      name: "Pro+",
      pricePerSeatMonthlyUsd: 39,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding"],
      notes: "Higher request limits + access to premium models.",
    },
    {
      id: "copilot-business",
      name: "Business",
      pricePerSeatMonthlyUsd: 19,
      minSeats: 1,
      bestForTeamSize: { min: 2, max: 100 },
      bestForUseCases: ["coding"],
      notes: "Pricing pending separate verification (not shown on /plans).",
    },
  ],
  alternatives: [
    { toolId: "cursor", reason: "Similarly priced and considered stronger for refactoring/agent workflows." },
    { toolId: "windsurf", reason: "Comparable AI IDE at the $20/mo Pro tier." },
  ],
  overlapsWith: ["cursor", "windsurf"],
  creditPrograms: [
    {
      type: "student",
      description: "Free Copilot for verified students via GitHub Education.",
      url: "https://education.github.com/",
    },
    {
      type: "oss",
      description: "Free Copilot for maintainers of popular open-source projects.",
      url: "https://education.github.com/",
    },
  ],
};
