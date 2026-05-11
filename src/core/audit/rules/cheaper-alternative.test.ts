import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("cheaper-alternative rule", () => {
  it("recommends GitHub Copilot for an individual Cursor Pro user", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "coding",
      subscriptions: [
        {
          toolId: "cursor",
          planId: "cursor-pro",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
      ],
    });

    const finding = result.findings.find((f) => f.ruleId === "cheaper-alternative");
    expect(finding).toBeDefined();
    expect(finding!.title).toContain("GitHub Copilot");
    expect(finding!.estimatedMonthlySavingsUsd).toBe(10); // $20 cursor − $10 copilot pro
    // Recommendation is honest about switching cost, not a hard sell.
    expect(finding!.recommendation.toLowerCase()).toContain("trial");
  });

  it("does not flag when the alternative is already in the user's stack", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "coding",
      subscriptions: [
        {
          toolId: "cursor",
          planId: "cursor-pro",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
        {
          toolId: "github-copilot",
          planId: "copilot-pro",
          seats: 1,
          monthlySpendUsd: 10,
          billingCycle: "monthly",
        },
      ],
    });
    const finding = result.findings.find((f) => f.ruleId === "cheaper-alternative");
    expect(finding).toBeUndefined();
  });
});
