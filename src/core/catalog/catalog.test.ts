import { describe, expect, it } from "vitest";
import { CATALOG } from "./index";

const REQUIRED_TOOL_IDS = [
  "chatgpt",
  "openai-api",
  "claude",
  "anthropic-api",
  "cursor",
  "github-copilot",
  "gemini",
  "windsurf",
] as const;

describe("catalog sanity", () => {
  it("includes every tool required by the assignment PDF", () => {
    const present = new Set(CATALOG.tools.map((t) => t.id));
    for (const id of REQUIRED_TOOL_IDS) {
      expect(present.has(id), `missing required tool: ${id}`).toBe(true);
    }
  });

  it("has unique tool IDs", () => {
    const ids = CATALOG.tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique plan IDs across all tools", () => {
    const planIds = CATALOG.tools.flatMap((t) => t.plans.map((p) => p.id));
    expect(new Set(planIds).size).toBe(planIds.length);
  });

  it("every tool carries a verifiable pricing source and date", () => {
    for (const tool of CATALOG.tools) {
      expect(tool.pricingSource, `${tool.id} missing pricingSource`).toMatch(/^https?:\/\//);
      expect(tool.pricingVerifiedAt, `${tool.id} missing pricingVerifiedAt`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
    }
  });

  it("subscription tools have at least one plan; usage tools have usageRates", () => {
    for (const tool of CATALOG.tools) {
      if (tool.pricingModel === "subscription") {
        expect(tool.plans.length, `${tool.id} (subscription) needs plans`).toBeGreaterThan(0);
      }
      if (tool.pricingModel === "usage") {
        expect(tool.usageRates, `${tool.id} (usage) needs usageRates`).toBeDefined();
        expect(tool.usageRates!.models.length).toBeGreaterThan(0);
      }
    }
  });
});
