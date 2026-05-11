import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/core/audit/engine";
import type { AuditInput, AuditResult } from "@/core/audit/types";
import { createServerClient } from "@/lib/supabase";

const subscriptionSchema = z.object({
  toolId: z.string().min(1),
  planId: z.string().optional(),
  seats: z.number().int().min(1),
  monthlySpendUsd: z.number().min(0),
  billingCycle: z.enum(["monthly", "annual"]),
});

const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(1000),
  primaryUseCase: z.enum([
    "general-chat",
    "coding",
    "research",
    "writing",
    "image-generation",
    "api-integration",
    "data-analysis",
  ]),
  subscriptions: z.array(subscriptionSchema).min(1).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const input: AuditInput = parsed.data;
    const result: AuditResult = runAudit(input);

    // For Day 3, we use a simple fallback summary (no LLM yet)
    const summary = generateFallbackSummary(result);
    const summarySource: "llm" | "fallback" = "fallback";

    const supabase = createServerClient();

    // Insert audit record (no lead yet - that's Day 4)
    const { data: auditData, error: auditError } = await supabase
      .from("audits")
      .insert({
        inputs: input,
        result,
        summary,
        summary_source: summarySource,
        savings_usd: result.totalMonthlySavingsUsd,
        engine_version: result.engineVersion,
      })
      .select("id")
      .single();

    if (auditError) {
      console.error("Supabase insert error:", auditError);
      return NextResponse.json(
        { error: "Failed to save audit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: auditData.id }, { status: 201 });
  } catch (error) {
    console.error("Audit creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateFallbackSummary(result: AuditResult): string {
  const { findings, totalMonthlySpendUsd, totalMonthlySavingsUsd, savingsPct } = result;

  if (findings.length === 0) {
    return `Your AI spend of $${totalMonthlySpendUsd.toFixed(0)}/mo appears well-optimized. No immediate savings opportunities were found based on your current tool configuration and team size.`;
  }

  const savingsAmount = totalMonthlySavingsUsd.toFixed(0);
  const savingsPercentage = savingsPct;

  let summary = `Based on your audit, we identified ${findings.length} opportunity${findings.length > 1 ? "ies" : ""} to optimize your AI spend of $${totalMonthlySpendUsd.toFixed(0)}/mo. You could save approximately $${savingsAmount}/mo (${savingsPercentage}%) by addressing the findings below.\n\n`;

  if (findings.length <= 3) {
    summary += findings
      .slice(0, 3)
      .map((f, i) => `${i + 1}. ${f.title}: Save $${f.estimatedMonthlySavingsUsd.toFixed(0)}/mo`)
      .join("\n");
  } else {
    const top3 = findings.slice(0, 3);
    summary += "Top opportunities:\n";
    summary += top3
      .map((f, i) => `${i + 1}. ${f.title}: Save $${f.estimatedMonthlySavingsUsd.toFixed(0)}/mo`)
      .join("\n");
    summary += `\nPlus ${findings.length - 3} additional optimization opportunities.`;
  }

  return summary;
}
