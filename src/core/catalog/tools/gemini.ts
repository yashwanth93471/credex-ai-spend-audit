import type { Tool } from "../types";

/**
 * Gemini (Google AI consumer plans).
 * Source: https://gemini.google/subscriptions/?hl=en
 *   (one.google.com/about/google-ai-plans serves regional localisation —
 *    it returned INR pricing with no USD when fetched, so we use the
 *    explicitly-en gemini.google subscriptions URL instead.)
 *
 * Excluded: Workspace add-ons (priced into Workspace seat tiers, vary by region).
 *
 * Verification (2026-05-08):
 *   - "Google AI Plus" ($7.99/mo) added — was missing from the original catalog.
 *   - Pro and Ultra prices unchanged.
 *   - Removed dated "previously Gemini Advanced" framing for Pro.
 */
export const gemini: Tool = {
  id: "gemini",
  name: "Gemini",
  vendor: "Google",
  category: "general-ai-assistant",
  pricingModel: "subscription",
  pricingSource: "https://gemini.google/subscriptions/?hl=en",
  pricingVerifiedAt: "2026-05-08",
  pricingNote: "Plans bundle Google AI access with cloud storage; standalone Gemini access not available below Plus tier.",
  plans: [
    {
      id: "gemini-free",
      name: "Free",
      pricePerSeatMonthlyUsd: 0,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat"],
      notes: "Includes Gemini 3 Flash with limited 3.1 Pro access; 15 GB storage.",
    },
    {
      id: "gemini-plus",
      name: "Google AI Plus",
      pricePerSeatMonthlyUsd: 7.99,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat", "research", "writing"],
      notes: "Enhanced 3.1 Pro access, image generation, NotebookLM, 200 GB storage.",
    },
    {
      id: "gemini-pro",
      name: "Google AI Pro",
      pricePerSeatMonthlyUsd: 19.99,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["general-chat", "research", "writing"],
      notes: "Higher 3.1 Pro access, Veo 3.1 Lite, Jules coding agent, 5 TB storage.",
    },
    {
      id: "gemini-ultra",
      name: "Google AI Ultra",
      pricePerSeatMonthlyUsd: 249.99,
      bestForTeamSize: { min: 1, max: 1 },
      bestForUseCases: ["research", "data-analysis", "coding"],
      notes: "Highest individual tier; Deep Think, Veo 3.1, YouTube Premium, 30 TB storage.",
    },
  ],
  alternatives: [
    { toolId: "chatgpt", reason: "Most-comparable consumer assistant; broader plugin/agent ecosystem." },
    { toolId: "claude", reason: "Comparable price at Pro tier; preferred for long-context tasks." },
  ],
  overlapsWith: ["chatgpt", "claude"],
  creditPrograms: [
    {
      type: "startup",
      description: "Google for Startups Cloud Program — credits include Gemini API usage.",
      url: "https://cloud.google.com/startup",
    },
  ],
};
