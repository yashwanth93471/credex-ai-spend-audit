import type { Tool } from "../types";

/**
 * Claude (Anthropic consumer subscriptions).
 * Source: https://claude.com/pricing  (anthropic.com/pricing 301-redirects here)
 *
 * Excluded: Claude Enterprise (custom pricing — page lists "$20/seat + usage cost"
 * but the published number is an entry point, not a final per-seat figure).
 *
 * Verification (2026-05-08): Pro/Max 5×/Team confirmed against live page.
 * Team prices DROPPED since the original draft ($30→$25 monthly, $25→$20 annual).
 * Team Premium seat tier added — was missing in the original catalog.
 * Max 20× tier intentionally OMITTED — the live page shows Max as a single plan
 * "starting at $100/mo (pricing varies by usage tier)" without a clean $200/mo
 * 20× number. Re-add only after a fresh manual verification confirms the price.
 */
export const claude: Tool = {
  id: "claude",
  name: "Claude",
  vendor: "Anthropic",
  category: "general-ai-assistant",
  pricingModel: "subscription",
  pricingSource: "https://claude.com/pricing",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "Verified 2026-05-08. Max 20× omitted — live page wording ambiguous.",
  plans: [
    {
      id: "claude-free",
      name: "Free",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat"],
    },
    {
      id: "claude-pro",
      name: "Pro",
      pricePerSeatMonthlyUsd: 20,
      pricePerSeatAnnualMonthlyUsd: 17,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat", "research", "writing", "coding"],
    },
    {
      id: "claude-max-5x",
      name: "Max (5×)",
      pricePerSeatMonthlyUsd: 100,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["coding", "research", "data-analysis"],
      notes: "5× the usage limits of Pro.",
    },
    {
      id: "claude-team",
      name: "Team — Standard seat",
      pricePerSeatMonthlyUsd: 25,
      pricePerSeatAnnualMonthlyUsd: 20,
      minSeats: 5,
      maxSeats: 150,
      bestForTeamSize: { min: 5, max: 150 },
      bestForUseCases: ["general-chat", "research", "writing", "coding"],
    },
    {
      id: "claude-team-premium",
      name: "Team — Premium seat",
      pricePerSeatMonthlyUsd: 125,
      pricePerSeatAnnualMonthlyUsd: 100,
      minSeats: 5,
      maxSeats: 150,
      bestForTeamSize: { min: 5, max: 150 },
      bestForUseCases: ["coding", "research", "data-analysis"],
      notes: "Premium seat within Team; higher Claude Code limits.",
    },
  ],
  alternatives: [
    { toolId: "chatgpt", reason: "Most-comparable consumer assistant; matched price points." },
    { toolId: "gemini", reason: "Cheaper if Google Workspace integration matters." },
  ],
  overlapsWith: ["chatgpt", "gemini"],
  creditPrograms: [
    {
      type: "startup",
      description: "Anthropic for Startups — API credits, not consumer plan discounts.",
      url: "https://www.anthropic.com/startups",
    },
  ],
};
