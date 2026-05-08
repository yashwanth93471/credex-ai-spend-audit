import type { Tool } from "../types";

/**
 * ChatGPT (OpenAI consumer subscriptions).
 * Source: https://openai.com/chatgpt/pricing/
 *
 * **UNVERIFIED on 2026-05-08:** WebFetch returned 403 Forbidden against the
 * live pricing page (anti-bot blocking). Values below are inherited from the
 * initial draft (training-data baseline) and have NOT been confirmed against
 * the live source in this session. Manual verification required before any
 * demo — see PRICING_DATA.md.
 *
 * Excluded from the catalog: ChatGPT Enterprise (custom pricing) and ChatGPT Edu
 * (custom pricing). Users on those tiers should be flagged for manual review.
 * Possibly missing tiers to investigate: ChatGPT Business, ChatGPT Go.
 */
export const chatgpt: Tool = {
  id: "chatgpt",
  name: "ChatGPT",
  vendor: "OpenAI",
  category: "general-ai-assistant",
  pricingModel: "subscription",
  pricingSource: "https://openai.com/chatgpt/pricing/",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "UNVERIFIED on 2026-05-08 (WebFetch 403). Values inherited from initial draft — manual verification pending.",
  plans: [
    {
      id: "chatgpt-free",
      name: "Free",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat"],
      notes: "Limited GPT-4o access; fits casual single-user only.",
    },
    {
      id: "chatgpt-plus",
      name: "Plus",
      pricePerSeatMonthlyUsd: 20,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat", "research", "writing"],
    },
    {
      id: "chatgpt-pro",
      name: "Pro",
      pricePerSeatMonthlyUsd: 200,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["research", "data-analysis", "coding"],
      notes: "Heavy single-user; o1 pro mode + extended limits.",
    },
    {
      id: "chatgpt-team",
      name: "Team",
      pricePerSeatMonthlyUsd: 30,
      pricePerSeatAnnualMonthlyUsd: 25,
      minSeats: 2,
      bestForTeamSize: { min: 2, max: 50 },
      bestForUseCases: ["general-chat", "research", "writing", "data-analysis"],
    },
  ],
  alternatives: [
    { toolId: "claude", reason: "Comparable general-purpose assistant; often preferred for writing." },
    { toolId: "gemini", reason: "Cheaper if you already pay for Google Workspace." },
  ],
  overlapsWith: ["claude", "gemini"],
  creditPrograms: [
    {
      type: "startup",
      description: "OpenAI for Startups — API credits (does not apply to ChatGPT subscriptions).",
      url: "https://openai.com/forms/openai-startups/",
    },
  ],
};
