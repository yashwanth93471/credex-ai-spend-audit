import type { AuditResult } from "../audit/types";

/**
 * Deterministic fallback summary.
 * Used when AI summary fails or API key is missing.
 */
export function generateFallback(result: AuditResult): string {
  const { findings, totalMonthlySpendUsd, totalMonthlySavingsUsd, savingsPct } = result;

  if (findings.length === 0) {
    return `Your AI spend of $${totalMonthlySpendUsd.toFixed(0)}/mo appears well-optimized. No immediate savings opportunities were found based on your current tool configuration and team size.`;
  }

  const savingsAmount = totalMonthlySavingsUsd.toFixed(0);
  const savingsPercentage = savingsPct;

  let summary = `Based on your audit, we identified ${findings.length} opportunity${findings.length > 1 ? "ies" : ""} to optimize your AI spend of $${totalMonthlySpendUsd.toFixed(0)}/mo. You could save approximately $${savingsAmount}/mo (${savingsPercentage}%) by addressing the findings below.\n\n`;

  if (findings.length <= 3) {
    summary += findings
      .slice(0, 3)
      .map((f, i) => `${i + 1}. ${f.title}: Save $${f.estimatedMonthlySavingsUsd.toFixed(0)}/mo`)
      .join("\n");
  } else {
    const top3 = findings.slice(0, 3);
    summary += "Top opportunities:\n";
    summary += top3
      .map((f, i) => `${i + 1}. ${f.title}: Save $${f.estimatedMonthlySavingsUsd.toFixed(0)}/mo`)
      .join("\n");
    summary += `\nPlus ${findings.length - 3} additional optimization opportunities.`;
  }

  return summary;
}
