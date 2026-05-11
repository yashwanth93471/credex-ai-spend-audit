import { describe, expect, it } from "vitest";
import { runAudit } from "../engine";

describe("overpriced-plan rule", () => {
  it("recommends downgrading ChatGPT Pro → Plus for a single general-chat user", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-pro",
          seats: 1,
          monthlySpendUsd: 200,
          billingCycle: "monthly",
        },
      ],
    });

    const finding = result.findings.find((f) => f.ruleId === "overpriced-plan");
    expect(finding).toBeDefined();
    expect(finding!.title).toContain("ChatGPT");
    expect(finding!.title).toContain("Plus");
    expect(finding!.estimatedMonthlySavingsUsd).toBe(180);
    expect(finding!.evidence.affectsToolIds).toEqual(["chatgpt"]);
  });

  it("emits no finding when the user is already on the cheapest matching plan", () => {
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
    const finding = result.findings.find((f) => f.ruleId === "overpriced-plan");
    expect(finding).toBeUndefined();
  });
});
