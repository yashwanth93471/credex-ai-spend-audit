/**
 * Catalog types — the shape of every SaaS tool we evaluate against.
 *
 * Each Tool is one of:
 *  - subscription: priced per seat (e.g., ChatGPT Team)
 *  - usage: priced per token / per request (e.g., OpenAI API)
 *  - hybrid: both plans and usage matter (rare in this catalog)
 */

export type ToolCategory =
  | "general-ai-assistant"
  | "code-assistant"
  | "developer-api"
  | "image-generation";

export type UseCase =
  | "general-chat"
  | "coding"
  | "research"
  | "writing"
  | "image-generation"
  | "api-integration"
  | "data-analysis";

export type BillingCycle = "monthly" | "annual";

export type Plan = {
  id: string;
  name: string;
  /** Monthly per-seat price in USD when billed month-to-month. */
  pricePerSeatMonthlyUsd: number;
  /**
   * Effective monthly per-seat price in USD when billed annually
   * (e.g., $17/mo if a $20/mo plan offers an annual discount). Omit if no annual option.
   */
  pricePerSeatAnnualMonthlyUsd?: number;
  minSeats?: number;
  maxSeats?: number;
  bestForTeamSize?: { min: number; max: number };
  bestForUseCases?: UseCase[];
  notes?: string;
};

export type ApiModel = {
  id: string;
  name: string;
  /** USD per 1M input tokens. */
  inputPer1M: number;
  /** USD per 1M output tokens. */
  outputPer1M: number;
  /** USD per 1M cached input tokens, if the provider supports prompt caching. */
  cachedInputPer1M?: number;
  notes?: string;
};

export type UsageRates = {
  models: ApiModel[];
  /** Fractional discount when using the provider's batch API (e.g., 0.5 = 50% off). */
  batchDiscount?: number;
  promptCachingSupported?: boolean;
};

export type CreditProgram = {
  type: "startup" | "student" | "oss" | "edu" | "nonprofit";
  description: string;
  url: string;
};

export type AlternativeRef = {
  toolId: string;
  reason: string;
};

export type Tool = {
  id: string;
  name: string;
  vendor: string;
  category: ToolCategory;
  pricingModel: "subscription" | "usage" | "hybrid";
  plans: Plan[];
  usageRates?: UsageRates;
  alternatives?: AlternativeRef[];
  creditPrograms?: CreditProgram[];
  /** IDs of other tools whose function meaningfully overlaps with this one. */
  overlapsWith?: string[];
  /** Vendor pricing page URL — required for spot-check verification. */
  pricingSource: string;
  /** ISO date when prices were last verified against the source. */
  pricingVerifiedAt: string;
  /** Optional human-readable note about pricing edge cases or regions. */
  pricingNote?: string;
};

export type Catalog = {
  tools: readonly Tool[];
  /** Earliest "effective from" date the catalog is meant to represent. */
  effectiveFrom: string;
};
