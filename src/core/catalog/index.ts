import type { Catalog, Tool } from "./types";
import { chatgpt } from "./tools/chatgpt";
import { openaiApi } from "./tools/openai-api";
import { claude } from "./tools/claude";
import { anthropicApi } from "./tools/anthropic-api";
import { cursor } from "./tools/cursor";
import { githubCopilot } from "./tools/github-copilot";
import { gemini } from "./tools/gemini";
import { windsurf } from "./tools/windsurf";

/**
 * The full Credex tool catalog.
 *
 * Every tool listed here is required by the assignment PDF.
 * Pricing accuracy is paramount — see PRICING_DATA.md for the verification log.
 *
 * Enterprise / custom-priced tiers are deliberately excluded; the audit form
 * accepts them as free-form input but the engine does not score them.
 */
export const CATALOG: Catalog = {
  effectiveFrom: "2026-05-01",
  tools: [
    chatgpt,
    openaiApi,
    claude,
    anthropicApi,
    cursor,
    githubCopilot,
    gemini,
    windsurf,
  ],
};

export function getToolById(id: string): Tool | undefined {
  return CATALOG.tools.find((t) => t.id === id);
}

export function getPlanById(toolId: string, planId: string) {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.id === planId);
}

export type { Tool, Catalog } from "./types";
