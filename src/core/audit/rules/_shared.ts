import type { Catalog, Plan, Tool, UseCase } from "../../catalog/types";
import type { Severity, SubscriptionInput } from "../types";

/**
 * Helpers shared across rules. Pure functions only — no I/O, no globals.
 */

export function findToolById(catalog: Catalog, id: string): Tool | undefined {
  return catalog.tools.find((t) => t.id === id);
}

export function findPlanById(
  catalog: Catalog,
  toolId: string,
  planId: string,
): Plan | undefined {
  return findToolById(catalog, toolId)?.plans.find((p) => p.id === planId);
}

/**
 * Effective per-seat price given the user's billing cycle.
 * Falls back to the monthly price if the plan has no annual rate.
 */
export function effectivePerSeatPrice(plan: Plan, billingCycle: "monthly" | "annual"): number {
  if (billingCycle === "annual" && plan.pricePerSeatAnnualMonthlyUsd !== undefined) {
    return plan.pricePerSeatAnnualMonthlyUsd;
  }
  return plan.pricePerSeatMonthlyUsd;
}

/**
 * Whether a plan's seat constraints and bestForTeamSize range allow this team
 * to be on this plan. Conservative: if any constraint excludes them, return false.
 */
export function planFitsTeam(plan: Plan, teamSize: number, seats: number): boolean {
  if (plan.minSeats !== undefined && seats < plan.minSeats) return false;
  if (plan.maxSeats !== undefined && seats > plan.maxSeats) return false;
  if (plan.bestForTeamSize) {
    if (teamSize < plan.bestForTeamSize.min) return false;
    if (teamSize > plan.bestForTeamSize.max) return false;
  }
  return true;
}

/**
 * Whether a plan's bestForUseCases covers the user's primary use case.
 * Plans with no bestForUseCases are treated as matching anything (rare).
 */
export function planMatchesUseCase(plan: Plan, useCase: UseCase): boolean {
  if (!plan.bestForUseCases) return true;
  return plan.bestForUseCases.includes(useCase);
}

/**
 * Severity tiers based on monthly USD impact.
 * Numbers are subjective but documented; bump if real data shows different bands.
 *   high   ≥ $50/mo   — material to a startup AI budget
 *   medium ≥ $15/mo   — meaningful, worth the click
 *   low    < $15/mo   — small, plus all $0 advisories (e.g. credit-program)
 */
export function severityFromSavings(monthlyUsd: number): Severity {
  if (monthlyUsd >= 50) return "high";
  if (monthlyUsd >= 15) return "medium";
  return "low";
}

/** Round to 2 decimal places — display-friendly USD. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Pluralize "seat" — small UX thing used in a lot of recommendations. */
export function seatWord(n: number): string {
  return n === 1 ? "seat" : "seats";
}

export type SubWithToolPlan = {
  sub: SubscriptionInput;
  tool: Tool;
  plan: Plan;
};

/**
 * Common shape: subscription + its (catalog-resolved) tool + plan.
 * Returns null entries where tool/plan can't be resolved — caller filters.
 */
export function resolveSubscriptions(
  catalog: Catalog,
  subs: SubscriptionInput[],
): SubWithToolPlan[] {
  const out: SubWithToolPlan[] = [];
  for (const sub of subs) {
    const tool = findToolById(catalog, sub.toolId);
    if (!tool) continue;
    if (!sub.planId) continue;
    const plan = tool.plans.find((p) => p.id === sub.planId);
    if (!plan) continue;
    out.push({ sub, tool, plan });
  }
  return out;
}
