import type { Plan } from "../../catalog/types";
import type { Rule } from "../types";
import {
  effectivePerSeatPrice,
  findToolById,
  planFitsTeam,
  planMatchesUseCase,
  round2,
  seatWord,
  severityFromSavings,
} from "./_shared";

/**
 * cheaper-alternative
 *
 * What it detects:
 *   The user pays for tool X, but a different tool Y (declared in
 *   X.alternatives) has a plan that fits their team + use case at materially
 *   lower cost AND the user does not already subscribe to Y.
 *
 * Why it's financially rational:
 *   Real switching cost exists (training, integrations, muscle memory) so
 *   we only fire when savings are BOTH ≥ 25% AND ≥ $10/mo. The threshold
 *   is intentionally high — we'd rather miss a small win than push a noisy
 *   "switch to save $4" recommendation that erodes trust.
 *
 * False positives we explicitly avoid:
 *   - Skip alternatives the user already subscribes to (overlapping-tools
 *     handles that case more directly).
 *   - Skip free-tier alternative plans (free tiers have hard caps not
 *     captured by bestForUseCases).
 *   - Require BOTH a 25% relative AND a $10/mo absolute saving.
 *   - Honest framing in the recommendation: "trial alongside" not "switch now".
 *     Switching cost is unmodellable; the user must judge it.
 *   - Only emit ONE alternative per current tool — pick the highest-saving.
 */

const MIN_SAVINGS_PCT = 0.25;
const MIN_SAVINGS_USD = 10;

export const cheaperAlternative: Rule = {
  id: "cheaper-alternative",
  name: "Cheaper alternative tool",
  evaluate(input, catalog) {
    const out = [];
    const subscribedToolIds = new Set(input.subscriptions.map((s) => s.toolId));

    for (const sub of input.subscriptions) {
      const tool = findToolById(catalog, sub.toolId);
      if (!tool) continue;
      if (sub.monthlySpendUsd === 0) continue;

      type Candidate = { altToolId: string; altToolName: string; plan: Plan; altCost: number; reason: string };
      const candidates: Candidate[] = [];

      for (const alt of tool.alternatives ?? []) {
        if (subscribedToolIds.has(alt.toolId)) continue;

        const altTool = findToolById(catalog, alt.toolId);
        if (!altTool || altTool.pricingModel !== "subscription") continue;

        const eligiblePlans = altTool.plans
          .filter((p) => p.pricePerSeatMonthlyUsd > 0)
          .filter((p) => planFitsTeam(p, input.teamSize, sub.seats))
          .filter((p) => planMatchesUseCase(p, input.primaryUseCase));

        if (eligiblePlans.length === 0) continue;

        const cheapest = eligiblePlans.reduce((best, p) =>
          effectivePerSeatPrice(p, sub.billingCycle) <
          effectivePerSeatPrice(best, sub.billingCycle)
            ? p
            : best,
        );
        const altCost = effectivePerSeatPrice(cheapest, sub.billingCycle) * sub.seats;
        candidates.push({
          altToolId: altTool.id,
          altToolName: altTool.name,
          plan: cheapest,
          altCost,
          reason: alt.reason,
        });
      }

      if (candidates.length === 0) continue;

      const best = candidates.reduce((a, b) => (b.altCost < a.altCost ? b : a));
      const savings = round2(sub.monthlySpendUsd - best.altCost);

      if (savings < MIN_SAVINGS_USD) continue;
      if (savings / sub.monthlySpendUsd < MIN_SAVINGS_PCT) continue;

      const altPerSeat = effectivePerSeatPrice(best.plan, sub.billingCycle);

      out.push({
        ruleId: "cheaper-alternative",
        severity: severityFromSavings(savings),
        title: `Consider ${best.altToolName} instead of ${tool.name}`,
        rationale:
          `${best.altToolName} ${best.plan.name} at $${altPerSeat}/seat/mo would cover your ` +
          `stated use case (${input.primaryUseCase.replace(/-/g, " ")}) at lower cost than ` +
          `your current ${tool.name} spend ($${sub.monthlySpendUsd.toFixed(0)}/mo). ${best.reason}`,
        recommendation:
          `Trial ${best.altToolName} ${best.plan.name} alongside ${tool.name} for two weeks ` +
          `before switching ${sub.seats} ${seatWord(sub.seats)}. Switching cost (workflow ` +
          `change) is real — only move if the savings hold up in practice.`,
        evidence: {
          metric: "monthlySpendUsd",
          observed: sub.monthlySpendUsd,
          expected: round2(best.altCost),
          affectsToolIds: [tool.id],
        },
        estimatedMonthlySavingsUsd: savings,
      });
    }
    return out;
  },
};
