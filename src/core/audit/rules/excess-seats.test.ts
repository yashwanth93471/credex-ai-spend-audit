import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("excess-seats rule", () => {
  it("flags 12 ChatGPT Team seats when the team is 5", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-team",
          seats: 12,
          monthlySpendUsd: 360,
          billingCycle: "monthly",
        },
      ],
    });

    const finding = result.findings.find((f) => f.ruleId === "excess-seats");
    expect(finding).toBeDefined();
    expect(finding!.evidence.observed).toBe(12);
    expect(finding!.evidence.expected).toBe(6); // ceil(5 * 1.2) = 6
    expect(finding!.estimatedMonthlySavingsUsd).toBe(180); // (12 - 6) * $30
  });

  it("does not flag when seats are within the 20% headroom buffer", () => {
    const result = runAudit({
      teamSize: 10,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-team",
          seats: 11, // 10% over team size — normal headroom
          monthlySpendUsd: 330,
          billingCycle: "monthly",
        },
      ],
    });
    const finding = result.findings.find((f) => f.ruleId === "excess-seats");
    expect(finding).toBeUndefined();
  });
});
