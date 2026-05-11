import { CATALOG } from "../catalog";
import type { Catalog } from "../catalog/types";
import { RULES } from "./rules";
import type { AuditInput, AuditResult, Finding } from "./types";

/**
 * Engine version — bump on rule logic changes.
 * Stored on each AuditResult so historical reports remain reproducible
 * after the rules evolve.
 */
export const ENGINE_VERSION = "0.1.0";

/**
 * Total achievable savings, with per-tool deduplication.
 *
 * Why per-tool MAX rather than naive sum:
 *   If overpriced-plan says "downgrade ChatGPT, save $80" AND annual-discount
 *   says "switch ChatGPT to annual, save $30", these are NOT additive —
 *   the user makes one decision per tool. Naive summation would over-promise.
 *
 *   Limitation: when a single decision affects multiple tools (overlapping-
 *   tools attributes savings to the dropped tool only), we slightly under-
 *   count if the kept tool also has its own findings. Acceptable trade-off
 *   for honesty.
 */
function computeTotalSavings(findings: Finding[]): number {
  const byTool: Record<string, number> = {};
  for (const f of findings) {
    for (const tid of f.evidence.affectsToolIds ?? []) {
      const current = byTool[tid] ?? 0;
      if (f.estimatedMonthlySavingsUsd > current) {
        byTool[tid] = f.estimatedMonthlySavingsUsd;
      }
    }
  }
  return Object.values(byTool).reduce((sum, v) => sum + v, 0);
}

/**
 * Pure: same input + same catalog + same `now` → same output.
 *
 * `now` is injectable for deterministic tests. Production callers pass nothing
 * and get `new Date()`.
 */
export function runAudit(
  input: AuditInput,
  catalog: Catalog = CATALOG,
  now: Date = new Date(),
): AuditResult {
  const findings: Finding[] = RULES.flatMap((r) => r.evaluate(input, catalog)).sort(
    (a, b) => b.estimatedMonthlySavingsUsd - a.estimatedMonthlySavingsUsd,
  );

  const totalMonthlySpendUsd = input.subscriptions.reduce(
    (sum, s) => sum + s.monthlySpendUsd,
    0,
  );
  const totalMonthlySavingsUsd = Math.round(computeTotalSavings(findings) * 100) / 100;
  const savingsPct =
    totalMonthlySpendUsd > 0
      ? Math.round((totalMonthlySavingsUsd / totalMonthlySpendUsd) * 100)
      : 0;

  return {
    inputs: input,
    findings,
    totalMonthlySpendUsd: Math.round(totalMonthlySpendUsd * 100) / 100,
    totalMonthlySavingsUsd,
    savingsPct,
    generatedAt: now.toISOString(),
    engineVersion: ENGINE_VERSION,
  };
}
