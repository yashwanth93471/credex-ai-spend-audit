import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("credit-program rule", () => {
  it("surfaces Anthropic startup credits for a small team using the API", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "api-integration",
      subscriptions: [
        {
          toolId: "anthropic-api",
          seats: 1,
          monthlySpendUsd: 300,
          billingCycle: "monthly",
        },
      ],
    });

    const finding = result.findings.find((f) => f.ruleId === "credit-program");
    expect(finding).toBeDefined();
    expect(finding!.severity).toBe("low");
    // Honest: $0 because eligibility isn't observable from form input.
    expect(finding!.estimatedMonthlySavingsUsd).toBe(0);
    expect(finding!.recommendation).toContain("https://www.anthropic.com/startups");
  });

  it("does not surface startup credits for large teams", () => {
    const result = runAudit({
      teamSize: 100,
      primaryUseCase: "api-integration",
      subscriptions: [
        {
          toolId: "anthropic-api",
          seats: 1,
          monthlySpendUsd: 300,
          billingCycle: "monthly",
        },
      ],
    });
    const finding = result.findings.find((f) => f.ruleId === "credit-program");
    expect(finding).toBeUndefined();
  });
});
