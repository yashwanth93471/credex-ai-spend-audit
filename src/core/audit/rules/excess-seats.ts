import type { Rule } from "../types";
import {
  effectivePerSeatPrice,
  findPlanById,
  findToolById,
  round2,
  seatWord,
  severityFromSavings,
} from "./_shared";

/**
 * excess-seats
 *
 * What it detects:
 *   The user pays for materially more seats than their team size, even
 *   accounting for normal headroom (new joiners, contractors).
 *
 * Why it's financially rational:
 *   Unused seats are pure waste — no behavioural change required, just a
 *   downgrade in the vendor's billing portal. Most vendors prorate.
 *
 * False positives we explicitly avoid:
 *   - 20% headroom: "10 seats for 9 people" is normal, not waste.
 *   - MIN_EXCESS_SEATS = 2: a single unused seat is noise.
 *   - Respect plan minSeats — don't recommend dropping below the plan floor.
 *   - Free plans (price = 0) — no savings possible.
 *   - API-direct tools (pricingModel === "usage") — no per-seat concept.
 *   - MIN_SAVINGS_USD threshold: tiny dollar amounts are noise.
 */

const SEAT_BUFFER_PCT = 0.2;
const MIN_EXCESS_SEATS = 2;
const MIN_SAVINGS_USD = 10;

export const excessSeats: Rule = {
  id: "excess-seats",
  name: "Excess seats",
  evaluate(input, catalog) {
    const out = [];
    for (const sub of input.subscriptions) {
      const tool = findToolById(catalog, sub.toolId);
      if (!tool || tool.pricingModel === "usage") continue;

      const plan = sub.planId ? findPlanById(catalog, sub.toolId, sub.planId) : undefined;
      if (!plan || plan.pricePerSeatMonthlyUsd === 0) continue;

      const allowedSeats = Math.ceil(input.teamSize * (1 + SEAT_BUFFER_PCT));
      const excess = sub.seats - allowedSeats;
      if (excess < MIN_EXCESS_SEATS) continue;

      const recommendedSeats = Math.max(allowedSeats, plan.minSeats ?? 1);
      const seatsToDrop = sub.seats - recommendedSeats;
      if (seatsToDrop <= 0) continue;

      const perSeatPrice = effectivePerSeatPrice(plan, sub.billingCycle);
      const savings = round2(seatsToDrop * perSeatPrice);
      if (savings < MIN_SAVINGS_USD) continue;

      out.push({
        ruleId: "excess-seats",
        severity: severityFromSavings(savings),
        title: `Cut ${seatsToDrop} unused ${tool.name} ${seatWord(seatsToDrop)}`,
        rationale:
          `You're paying for ${sub.seats} ${tool.name} ${seatWord(sub.seats)} ` +
          `but your team is ${input.teamSize}. ${recommendedSeats} ${seatWord(recommendedSeats)} ` +
          `covers the team with ~20% headroom for new joiners.`,
        recommendation:
          `Drop ${seatsToDrop} ${seatWord(seatsToDrop)} in the ${tool.name} billing portal. ` +
          `Most vendors prorate mid-cycle.`,
        evidence: {
          metric: "seats",
          observed: sub.seats,
          expected: recommendedSeats,
          affectsToolIds: [tool.id],
        },
        estimatedMonthlySavingsUsd: savings,
      });
    }
    return out;
  },
};
