import type { Rule } from "../types";
import {
  effectivePerSeatPrice,
  findPlanById,
  findToolById,
  planFitsTeam,
  planMatchesUseCase,
  round2,
  seatWord,
  severityFromSavings,
} from "./_shared";

/**
 * overpriced-plan
 *
 * What it detects:
 *   The user is on a plan from tool X that costs more per seat than another
 *   plan from the SAME tool X which would still cover their team size and
 *   stated primary use case.
 *
 * Why it's financially rational:
 *   Same vendor, same product surface, lower tier — the action is a billing
 *   portal click, not a tool migration. Highest-confidence recommendation
 *   in the engine.
 *
 * False positives we explicitly avoid:
 *   - Recommending a free plan (free tiers usually have hard usage caps not
 *     captured by bestForUseCases). We never recommend a $0 plan.
 *   - Recommending a plan that doesn't fit the team-size constraints
 *     (filtered via planFitsTeam — respects min/max seats and bestForTeamSize).
 *   - Recommending a plan whose bestForUseCases doesn't cover the user's
 *     primary use case.
 *   - Noise: any saving below MIN_SAVINGS_USD is dropped.
 */

const MIN_SAVINGS_USD = 10;

export const overpricedPlan: Rule = {
  id: "overpriced-plan",
  name: "Overpriced plan",
  evaluate(input, catalog) {
    const out = [];
    for (const sub of input.subscriptions) {
      const tool = findToolById(catalog, sub.toolId);
      if (!tool || tool.pricingModel === "usage") continue;

      const currentPlan = sub.planId ? findPlanById(catalog, sub.toolId, sub.planId) : undefined;
      if (!currentPlan) continue;

      const currentPrice = effectivePerSeatPrice(currentPlan, sub.billingCycle);
      if (currentPrice === 0) continue;

      const eligible = tool.plans
        .filter((p) => p.id !== currentPlan.id)
        .filter((p) => effectivePerSeatPrice(p, sub.billingCycle) > 0) // never recommend free
        .filter((p) => planFitsTeam(p, input.teamSize, sub.seats))
        .filter((p) => planMatchesUseCase(p, input.primaryUseCase))
        .filter((p) => effectivePerSeatPrice(p, sub.billingCycle) < currentPrice);

      if (eligible.length === 0) continue;

      const cheapest = eligible.reduce((best, p) =>
        effectivePerSeatPrice(p, sub.billingCycle) < effectivePerSeatPrice(best, sub.billingCycle)
          ? p
          : best,
      );

      const cheapestPrice = effectivePerSeatPrice(cheapest, sub.billingCycle);
      const savings = round2((currentPrice - cheapestPrice) * sub.seats);
      if (savings < MIN_SAVINGS_USD) continue;

      out.push({
        ruleId: "overpriced-plan",
        severity: severityFromSavings(savings),
        title: `Downgrade ${tool.name} ${currentPlan.name} → ${cheapest.name}`,
        rationale:
          `You're on ${tool.name} ${currentPlan.name} at $${currentPrice}/seat/mo for ` +
          `${sub.seats} ${seatWord(sub.seats)}. For your team size (${input.teamSize}) and ` +
          `primary use case (${input.primaryUseCase.replace(/-/g, " ")}), the ${cheapest.name} ` +
          `plan at $${cheapestPrice}/seat/mo covers the same workflow.`,
        recommendation:
          `Switch to ${tool.name} ${cheapest.name} at $${cheapestPrice}/seat/mo × ` +
          `${sub.seats} ${seatWord(sub.seats)}.`,
        evidence: {
          metric: "pricePerSeatMonthlyUsd",
          observed: currentPrice,
          expected: cheapestPrice,
          affectsToolIds: [tool.id],
        },
        estimatedMonthlySavingsUsd: savings,
      });
    }
    return out;
  },
};
