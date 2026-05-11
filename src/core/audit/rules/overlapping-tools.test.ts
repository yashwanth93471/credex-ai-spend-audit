import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("overlapping-tools rule", () => {
  it("flags ChatGPT + Claude as overlapping for a single user", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-plus",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
        {
          toolId: "claude",
          planId: "claude-pro",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
      ],
    });

    const findings = result.findings.filter((f) => f.ruleId === "overlapping-tools");
    expect(findings.length).toBe(1); // pair dedupe — not two findings for the same pair
    expect(findings[0].estimatedMonthlySavingsUsd).toBe(20);
    // Drops the more expensive of the pair; tied here so it falls through to first index.
    expect(findings[0].evidence.affectsToolIds).toContain("chatgpt");
  });

  it("does not flag when only one tool from a category is held", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-plus",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
      ],
    });
    const finding = result.findings.find((f) => f.ruleId === "overlapping-tools");
    expect(finding).toBeUndefined();
  });
});
