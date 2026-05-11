import type { Finding, Rule } from "../types";
import { findToolById } from "./_shared";

/**
 * credit-program
 *
 * What it detects:
 *   The user's team is small enough to plausibly qualify for a vendor's
 *   startup-credits program, AND they pay one of that vendor's tools.
 *
 * Why it's (cautiously) financially rational:
 *   Vendor startup programs (OpenAI for Startups, Anthropic for Startups,
 *   Google for Startups, etc.) hand out real credits — typically against
 *   API usage, not consumer subscriptions. Eligibility usually requires
 *   accelerator participation or early-stage status. We surface the
 *   programs and the URL; the user judges fit.
 *
 * Why we set estimatedMonthlySavingsUsd = 0:
 *   We have no signal whether the user actually qualifies. Promising
 *   savings we can't verify damages trust more than missing the upsell.
 *   The finding still appears (severity: low) — it just doesn't inflate
 *   the headline savings number.
 *
 * False positives we explicitly avoid:
 *   - teamSize > 25 → don't fire. Bigger teams are rarely "startups" by
 *     program criteria.
 *   - Only fires for type === "startup" programs. Student/OSS/edu programs
 *     need signal we don't have (verified-student status, OSS maintainer
 *     identity, .edu email) and would over-fire.
 *   - Dedupe by toolId — one finding per tool, even if user has multiple
 *     subscriptions to the same vendor.
 *   - Recommendation URL goes to the program page, not a fake quote.
 */

const STARTUP_TEAM_SIZE_THRESHOLD = 25;

export const creditProgram: Rule = {
  id: "credit-program",
  name: "Credit / discount program eligibility",
  evaluate(input, catalog) {
    const out: Finding[] = [];
    if (input.teamSize > STARTUP_TEAM_SIZE_THRESHOLD) return out;

    const seenTools = new Set<string>();

    for (const sub of input.subscriptions) {
      if (seenTools.has(sub.toolId)) continue;

      const tool = findToolById(catalog, sub.toolId);
      if (!tool || !tool.creditPrograms || tool.creditPrograms.length === 0) continue;

      const startupPrograms = tool.creditPrograms.filter((p) => p.type === "startup");
      if (startupPrograms.length === 0) continue;

      seenTools.add(sub.toolId);

      const urls = startupPrograms.map((p) => p.url).join(" / ");

      out.push({
        ruleId: "credit-program",
        severity: "low" as const,
        title: `Check ${tool.vendor} startup credits for ${tool.name}`,
        rationale:
          `${tool.vendor} runs a startup credits program. With a team of ${input.teamSize} ` +
          `(≤ ${STARTUP_TEAM_SIZE_THRESHOLD}) you may qualify, though eligibility usually ` +
          `requires accelerator participation or documented early-stage status. Credits ` +
          `typically apply to API usage, not consumer subscriptions.`,
        recommendation:
          `Apply via ${urls}. If approved, you can offset some of your ${tool.name} spend.`,
        evidence: {
          metric: "teamSize",
          observed: input.teamSize,
          expected: `≤ ${STARTUP_TEAM_SIZE_THRESHOLD}`,
          affectsToolIds: [tool.id],
        },
        // Honest: we can't predict the actual amount without knowing eligibility.
        estimatedMonthlySavingsUsd: 0,
      });
    }
    return out;
  },
};
