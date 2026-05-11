import type { Rule } from "../types";
import {
  findPlanById,
  findToolById,
  round2,
  seatWord,
  severityFromSavings,
} from "./_shared";

/**
 * annual-discount
 *
 * What it detects:
 *   The user is billed monthly on a plan that publishes a cheaper annual
 *   per-seat price (catalog has pricePerSeatAnnualMonthlyUsd set).
 *
 * Why it's financially rational:
 *   Same plan, same features — only commitment changes. Discount is real
 *   and immediate. Trade-off (no mid-cycle cancellation) is small for tools
 *   the user already actively pays for.
 *
 * False positives we explicitly avoid:
 *   - Skip if plan has no published annual rate.
 *   - Skip if user is already on annual.
 *   - Skip if the annual rate isn't actually cheaper (defensive).
 *   - MIN_SAVINGS_USD threshold avoids "save $2/mo" noise.
 *   - Recommendation explicitly names the trade-off (yearly commitment) so
 *     the user isn't surprised when they go to switch.
 */

const MIN_SAVINGS_USD = 10;

export const annualDiscount: Rule = {
  id: "annual-discount",
  name: "Annual billing discount available",
  evaluate(input, catalog) {
    const out = [];
    for (const sub of input.subscriptions) {
      if (sub.billingCycle !== "monthly") continue;

      const tool = findToolById(catalog, sub.toolId);
      if (!tool) continue;

      const plan = sub.planId ? findPlanById(catalog, sub.toolId, sub.planId) : undefined;
      if (!plan || plan.pricePerSeatAnnualMonthlyUsd === undefined) continue;

      const monthlyPrice = plan.pricePerSeatMonthlyUsd;
      const annualPrice = plan.pricePerSeatAnnualMonthlyUsd;
      if (annualPrice >= monthlyPrice) continue;

      const savings = round2((monthlyPrice - annualPrice) * sub.seats);
      if (savings < MIN_SAVINGS_USD) continue;

      const discountPct = Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100);

      out.push({
        ruleId: "annual-discount",
        severity: severityFromSavings(savings),
        title: `Switch ${tool.name} to annual billing`,
        rationale:
          `${tool.name} ${plan.name} is ${discountPct}% cheaper at $${annualPrice}/seat/mo when ` +
          `billed annually vs $${monthlyPrice}/seat/mo monthly. Across ${sub.seats} ` +
          `${seatWord(sub.seats)}, that's $${savings.toFixed(0)}/mo of recurring savings.`,
        recommendation:
          `Switch ${sub.seats} ${seatWord(sub.seats)} to annual billing in the ${tool.name} ` +
          `account portal. Trade-off: yearly commitment — no mid-cycle cancellation.`,
        evidence: {
          metric: "billingCycle",
          observed: "monthly",
          expected: "annual",
          affectsToolIds: [tool.id],
        },
        estimatedMonthlySavingsUsd: savings,
      });
    }
    return out;
  },
};
