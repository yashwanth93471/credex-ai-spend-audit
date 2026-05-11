import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("annual-discount rule", () => {
  it("flags monthly billing on Claude Team for 5 seats", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "claude",
          planId: "claude-team",
          seats: 5,
          monthlySpendUsd: 125, // 5 × $25 monthly
          billingCycle: "monthly",
        },
      ],
    });

    const finding = result.findings.find((f) => f.ruleId === "annual-discount");
    expect(finding).toBeDefined();
    expect(finding!.estimatedMonthlySavingsUsd).toBe(25); // ($25 − $20) × 5
    // Recommendation surfaces the trade-off so the user isn't surprised.
    expect(finding!.recommendation.toLowerCase()).toContain("yearly commitment");
  });

  it("does not flag when the user is already on annual billing", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "claude",
          planId: "claude-team",
          seats: 5,
          monthlySpendUsd: 100,
          billingCycle: "annual",
        },
      ],
    });
    const finding = result.findings.find((f) => f.ruleId === "annual-discount");
    expect(finding).toBeUndefined();
  });
});
