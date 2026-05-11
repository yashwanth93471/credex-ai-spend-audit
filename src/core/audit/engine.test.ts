import { describe, expect, it } from "vitest";
import { ENGINE_VERSION, runAudit } from "./engine";
import type { AuditInput } from "./types";

const FIXED_NOW = new Date("2026-05-09T12:00:00Z");

describe("runAudit (engine)", () => {
  it("returns no findings and zero savings when the stack is well-configured", () => {
    // Team size > 25 keeps credit-program quiet; ChatGPT Team is already the
    // only plan that fits team size 30, on annual billing, no excess seats.
    const input: AuditInput = {
      teamSize: 30,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-team",
          seats: 30,
          monthlySpendUsd: 750, // 30 × $25 annual
          billingCycle: "annual",
        },
      ],
    };
    const result = runAudit(input, undefined, FIXED_NOW);
    expect(result.findings).toEqual([]);
    expect(result.totalMonthlySpendUsd).toBe(750);
    expect(result.totalMonthlySavingsUsd).toBe(0);
    expect(result.savingsPct).toBe(0);
    expect(result.engineVersion).toBe(ENGINE_VERSION);
    expect(result.generatedAt).toBe(FIXED_NOW.toISOString());
  });

  it("sorts findings by estimatedMonthlySavingsUsd descending", () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "chatgpt",
          planId: "chatgpt-pro",
          seats: 1,
          monthlySpendUsd: 200,
          billingCycle: "monthly",
        },
        {
          toolId: "claude",
          planId: "claude-team",
          seats: 5,
          monthlySpendUsd: 125,
          billingCycle: "monthly",
        },
      ],
    };
    const result = runAudit(input, undefined, FIXED_NOW);
    expect(result.findings.length).toBeGreaterThan(1);
    for (let i = 1; i < result.findings.length; i++) {
      expect(result.findings[i - 1].estimatedMonthlySavingsUsd).toBeGreaterThanOrEqual(
        result.findings[i].estimatedMonthlySavingsUsd,
      );
    }
  });

  it("composite scenario: multiple rules fire across a realistic stack", () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: "coding",
      subscriptions: [
        // excess-seats: 12 seats for a team of 5 (allowed = 6)
        {
          toolId: "chatgpt",
          planId: "chatgpt-team",
          seats: 12,
          monthlySpendUsd: 360,
          billingCycle: "monthly",
        },
        // overlapping-tools with github-copilot below
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
    };
    const result = runAudit(input, undefined, FIXED_NOW);

    const ruleIds = new Set(result.findings.map((f) => f.ruleId));
    expect(ruleIds.has("excess-seats")).toBe(true);
    expect(ruleIds.has("overlapping-tools")).toBe(true);
    expect(result.totalMonthlySavingsUsd).toBeGreaterThan(0);
    expect(result.totalMonthlySpendUsd).toBe(390);
    // Every finding carries evidence — non-negotiable.
    for (const f of result.findings) {
      expect(f.evidence).toBeDefined();
      expect(f.evidence.affectsToolIds?.length ?? 0).toBeGreaterThan(0);
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.recommendation.length).toBeGreaterThan(0);
    }
  });

  it("silently skips unknown tools and unknown plans without crashing", () => {
    const input: AuditInput = {
      teamSize: 1,
      primaryUseCase: "general-chat",
      subscriptions: [
        {
          toolId: "unknown-tool",
          planId: "fake-plan",
          seats: 1,
          monthlySpendUsd: 50,
          billingCycle: "monthly",
        },
        {
          toolId: "chatgpt",
          planId: "fake-chatgpt-plan",
          seats: 1,
          monthlySpendUsd: 20,
          billingCycle: "monthly",
        },
      ],
    };
    const result = runAudit(input, undefined, FIXED_NOW);
    expect(result.totalMonthlySpendUsd).toBe(70);
    // Engine ran; rules silently skipped what they couldn't audit.
    expect(result.findings).toBeDefined();
  });
});
