import type { Catalog, UseCase } from "../catalog/types";

/**
 * What the user submits via the form.
 * Trusted internally — the form/server-action validates before calling runAudit.
 */
export type SubscriptionInput = {
  /** Tool ID matching catalog. Unknown IDs are silently skipped by the engine. */
  toolId: string;
  /** Plan ID. May be undefined if the user is on a custom/Enterprise plan. */
  planId?: string;
  /** Number of paid seats. For usage-based tools, set to 1. */
  seats: number;
  /** What the user actually pays per month, in USD. Source of truth for cost. */
  monthlySpendUsd: number;
  billingCycle: "monthly" | "annual";
};

export type AuditInput = {
  teamSize: number;
  primaryUseCase: UseCase;
  /** Optional company name — currently unused but reserved for future heuristics. */
  company?: string;
  subscriptions: SubscriptionInput[];
};

export type Severity = "low" | "medium" | "high";

/**
 * Why the finding fired — the data the rule actually saw.
 * Mandatory on every Finding. Auditors must be able to show their work.
 */
export type Evidence = {
  /** Name of the metric being asserted on, e.g. "seats" or "billingCycle". */
  metric: string;
  observed: number | string;
  expected?: number | string;
  /**
   * Tool IDs this finding would change if acted upon.
   * Used by the engine to dedupe per-tool savings (avoid double-count when
   * multiple rules target the same subscription).
   */
  affectsToolIds?: string[];
};

export type Finding = {
  /** Stable across runs — for dedupe, dismissals, persistence. */
  ruleId: string;
  severity: Severity;
  title: string;
  /** WHY the finding applies, in plain language the user can verify. */
  rationale: string;
  /** WHAT to do, imperative and concrete. */
  recommendation: string;
  evidence: Evidence;
  estimatedMonthlySavingsUsd: number;
};

export type AuditResult = {
  inputs: AuditInput;
  /** Sorted by estimatedMonthlySavingsUsd descending. */
  findings: Finding[];
  totalMonthlySpendUsd: number;
  /**
   * Sum of per-tool MAX savings across findings — i.e. assumes the user can
   * act on the best recommendation per tool. Avoids double-counting when
   * overpriced-plan and annual-discount both fire on the same subscription.
   */
  totalMonthlySavingsUsd: number;
  savingsPct: number;
  generatedAt: string;
  engineVersion: string;
};

/**
 * A rule is a pure function over (input, catalog).
 * Rules return zero or more findings — most return one per matching
 * subscription; overlapping-tools returns one per pair.
 */
export type Rule = {
  id: string;
  name: string;
  evaluate: (input: AuditInput, catalog: Catalog) => Finding[];
};
