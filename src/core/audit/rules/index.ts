import type { Rule } from "../types";
import { annualDiscount } from "./annual-discount";
import { cheaperAlternative } from "./cheaper-alternative";
import { creditProgram } from "./credit-program";
import { excessSeats } from "./excess-seats";
import { overlappingTools } from "./overlapping-tools";
import { overpricedPlan } from "./overpriced-plan";

/**
 * Rule registry.
 *
 * Order is intentional but not load-bearing — the engine sorts findings by
 * estimatedMonthlySavingsUsd descending after running all rules. The order
 * here is rough "highest expected impact first" for easier debugging.
 *
 * Adding a new rule = create a file, add it here. The engine doesn't care.
 */
export const RULES: Rule[] = [
  overpricedPlan,
  excessSeats,
  overlappingTools,
  cheaperAlternative,
  annualDiscount,
  creditProgram,
];
