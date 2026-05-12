import Anthropic from "@anthropic-ai/sdk";
import type { GenerateSummaryResult, SummaryInput } from "./types";
import { generateFallback } from "./fallback";

const SYSTEM_PROMPT = `You are Credex, an AI spend audit assistant. Your job is to summarize audit findings in a clear, actionable way.

CRITICAL RULES:
1. NEVER generate financial recommendations. The audit engine's findings are the ONLY source of truth.
2. Summarize what the engine found. Do not invent new opportunities.
3. Explain the findings in plain language a non-technical founder can understand.
4. Be specific about the tools and amounts involved.
5. Keep it concise - under 200 words.
6. If there are no findings, say the stack is well-optimized.

The user just ran an audit and is viewing their results. Help them understand what they found.`;

const USER_PROMPT_TEMPLATE = (input: SummaryInput) => {
  const { result, teamSize, primaryUseCase } = input;
  const { findings, totalMonthlySpendUsd, totalMonthlySavingsUsd, savingsPct } = result;

  let findingsText = "";
  if (findings.length === 0) {
    findingsText = "No optimization opportunities found.";
  } else {
    findingsText = findings
      .slice(0, 5)
      .map((f) => `- ${f.title}: Save $${f.estimatedMonthlySavingsUsd.toFixed(0)}/mo`)
      .join("\n");
  }

  return `Audit Summary:
- Team size: ${teamSize}
- Primary use case: ${primaryUseCase}
- Current monthly spend: $${totalMonthlySpendUsd.toFixed(0)}/mo
- Potential monthly savings: $${totalMonthlySavingsUsd.toFixed(0)}/mo (${savingsPct}%)
- Number of findings: ${findings.length}

Key findings:
${findingsText}

${findings.length > 5 ? `(Plus ${findings.length - 5} additional opportunities.)` : ""}

Write a concise summary of this audit in 1-2 paragraphs.`;
};

/**
 * Generate an AI summary using Anthropic Haiku.
 * Falls back to deterministic summary on any error.
 */
export async function generateSummary(input: SummaryInput): Promise<GenerateSummaryResult> {
  const { ANTHROPIC_API_KEY } = process.env;

  // No API key? Use fallback immediately.
  if (!ANTHROPIC_API_KEY) {
    return {
      summary: generateFallback(input.result),
      source: "fallback",
    };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
      timeout: 10000, // 10 second timeout
    });

    const userPrompt = USER_PROMPT_TEMPLATE(input);

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    const summary = message.content[0]?.type === "text" ? message.content[0].text : "";

    if (!summary) {
      throw new Error("Empty summary from LLM");
    }

    return { summary, source: "llm" };
  } catch (error) {
    // Any error = fallback. This is intentional - we'd rather show a
    // deterministic summary than crash or show degraded UX.
    console.error("AI summary generation failed, using fallback:", error);
    return {
      summary: generateFallback(input.result),
      source: "fallback",
    };
  }
}
