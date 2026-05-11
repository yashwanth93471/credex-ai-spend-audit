import type { Rule } from "../types";
import { findToolById, round2, severityFromSavings } from "./_shared";

/**
 * overlapping-tools
 *
 * What it detects:
 *   The user pays for two tools whose declared overlapsWith relationship
 *   indicates they cover meaningfully similar ground (e.g. ChatGPT + Claude,
 *   or Cursor + GitHub Copilot).
 *
 * Why it's financially rational:
 *   Two tools doing the same job = paying twice for the same outcome.
 *   Consolidating to one is a real, recurring saving — assuming the user
 *   isn't relying on tool-specific features (which we can't model).
 *
 * False positives we explicitly avoid:
 *   - Pair dedupe: A↔B is reported once, not twice (alphabetical pair key).
 *   - We never recommend dropping a tool whose category mismatches the other —
 *     overlapsWith is the ONLY signal; we don't fabricate cross-category overlaps.
 *   - Tie-break by total monthly spend: drop the more expensive of the pair.
 *     Conservative and obviously rational ("you save more").
 *   - MIN_SAVINGS_USD threshold so a $5 freemium-vs-freemium pair doesn't fire.
 *   - We frame the recommendation as "consolidate" — the user keeps something,
 *     they don't lose capability outright.
 */

const MIN_SAVINGS_USD = 10;

export const overlappingTools: Rule = {
  id: "overlapping-tools",
  name: "Overlapping tools",
  evaluate(input, catalog) {
    const out = [];
    const seenPairs = new Set<string>();

    for (let i = 0; i < input.subscriptions.length; i++) {
      for (let j = i + 1; j < input.subscriptions.length; j++) {
        const a = input.subscriptions[i];
        const b = input.subscriptions[j];
        if (a.toolId === b.toolId) continue;

        const toolA = findToolById(catalog, a.toolId);
        const toolB = findToolById(catalog, b.toolId);
        if (!toolA || !toolB) continue;

        const overlap =
          toolA.overlapsWith?.includes(b.toolId) || toolB.overlapsWith?.includes(a.toolId);
        if (!overlap) continue;

        const pairKey = [a.toolId, b.toolId].sort().join(":");
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        // Drop the more expensive of the two. Tie → drop A by index order.
        const dropIsA = a.monthlySpendUsd >= b.monthlySpendUsd;
        const dropSub = dropIsA ? a : b;
        const keepSub = dropIsA ? b : a;
        const dropTool = dropIsA ? toolA : toolB;
        const keepTool = dropIsA ? toolB : toolA;

        const savings = round2(dropSub.monthlySpendUsd);
        if (savings < MIN_SAVINGS_USD) continue;

        out.push({
          ruleId: "overlapping-tools",
          severity: severityFromSavings(savings),
          title: `Consolidate ${dropTool.name} and ${keepTool.name}`,
          rationale:
            `${dropTool.name} and ${keepTool.name} cover similar ground ` +
            `(${dropTool.category.replace(/-/g, " ")}). You're paying for both — ` +
            `$${dropSub.monthlySpendUsd.toFixed(0)}/mo and $${keepSub.monthlySpendUsd.toFixed(0)}/mo.`,
          recommendation:
            `Pick one. ${dropTool.name} is the more expensive of the pair, so dropping it ` +
            `and standardising on ${keepTool.name} saves the most. Trial for two weeks ` +
            `before cancelling — workflow lock-in is real.`,
          evidence: {
            metric: "duplicateCategory",
            observed: `${dropTool.id} + ${keepTool.id}`,
            affectsToolIds: [dropTool.id],
          },
          estimatedMonthlySavingsUsd: savings,
        });
      }
    }
    return out;
  },
};
