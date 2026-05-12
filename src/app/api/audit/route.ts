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
