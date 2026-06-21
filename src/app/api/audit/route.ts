import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/core/audit/engine";
import type { AuditInput, AuditResult } from "@/core/audit/types";
import { createServerClient } from "@/lib/supabase";
import { generateSummary } from "@/core/summary/generate";

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

    // Generate AI summary with deterministic fallback
    const { summary, source: summarySource } = await generateSummary({
      result,
      teamSize: input.teamSize,
      primaryUseCase: input.primaryUseCase,
    });

    // Persist to Supabase — non-blocking: if this fails the audit result is
    // returned inline so the user still receives their report.
    try {
      const supabase = createServerClient();

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

      if (auditError) throw auditError;

      return NextResponse.json({ id: auditData.id, persisted: true }, { status: 201 });
    } catch (persistError) {
      console.error("Supabase persistence error (non-fatal):", persistError);
      return NextResponse.json(
        { persisted: false, result, summary, summarySource },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Audit creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
