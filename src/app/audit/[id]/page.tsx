import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createClientClient } from "@/lib/supabase";
import type { AuditResult, Finding } from "@/core/audit/types";
import { CATALOG } from "@/core/catalog";
import { EmailCapture } from "./email-capture";
import { LoadingPage } from "@/components/ui/loading";

interface SeverityBadgeProps {
  severity: Finding["severity"];
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${styles[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getAudit(id: string) {
  const supabase = createClientClient();

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    inputs: unknown;
    result: AuditResult;
    summary: string;
    summary_source: "llm" | "fallback";
    savings_usd: number;
    engine_version: string;
    created_at: string;
    claimed_at: string | null;
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return {
      title: "Audit Not Found | Credex",
      description: "AI SaaS Spend Audit",
    };
  }

  const { result } = audit;
  const { totalMonthlySpendUsd, totalMonthlySavingsUsd, savingsPct } = result;

  const title = `Save $${totalMonthlySavingsUsd.toFixed(0)}/mo on AI Tools | Credex`;
  const description = `Your AI spend audit found ${result.findings.length} optimization opportunity${result.findings.length === 1 ? "" : "ies"}. Current spend: $${totalMonthlySpendUsd.toFixed(0)}/mo. Potential savings: $${totalMonthlySavingsUsd.toFixed(0)}/mo (${savingsPct}%).`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/audit/${id}`,
      siteName: "Credex",
      images: [
        {
          url: `/api/og/audit/${id}`,
          width: 1200,
          height: 630,
          alt: `Save $${totalMonthlySavingsUsd.toFixed(0)}/mo on AI Tools`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/audit/${id}`],
    },
  };
}

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  const { result, summary, created_at, claimed_at } = audit;
  const { findings, totalMonthlySpendUsd, totalMonthlySavingsUsd, savingsPct } = result;
  const isClaimed = claimed_at !== null;

  const getToolName = (toolId: string) => {
    return CATALOG.tools.find((t) => t.id === toolId)?.name || toolId;
  };

  const hasFindings = findings.length > 0;

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-zinc-900">AI Spend Audit Report</h1>
            <div className="text-sm text-zinc-500">
              {new Date(created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            {hasFindings ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-600 text-sm">Potential Monthly Savings</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalMonthlySavingsUsd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-600 text-sm">From Current Spend</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {formatCurrency(totalMonthlySpendUsd)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(savingsPct, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">{savingsPct}% savings</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-medium text-zinc-900">No savings opportunities found</p>
                <p className="text-zinc-600 mt-1">Your AI spend appears well-optimized.</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Current monthly spend: {formatCurrency(totalMonthlySpendUsd)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">Summary</h2>
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-700 whitespace-pre-line">{summary}</p>
          </div>
          {audit.summary_source === "fallback" && (
            <p className="mt-3 text-xs text-zinc-500">
              * This is an automated summary. AI-powered summaries coming soon.
            </p>
          )}
        </div>

        {/* Findings */}
        {hasFindings && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              Optimization Opportunities ({findings.length})
            </h2>

            {findings.map((finding, index) => (
              <div
                key={`${finding.ruleId}-${index}`}
                className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={finding.severity} />
                      <h3 className="text-base font-semibold text-zinc-900">{finding.title}</h3>
                    </div>
                    <p className="text-zinc-700 text-sm mb-3">{finding.rationale}</p>
                    <div className="bg-zinc-50 rounded-lg p-3">
                      <p className="text-sm text-zinc-600">
                        <span className="font-medium text-zinc-900">Recommendation:</span>{" "}
                        {finding.recommendation}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs text-zinc-500 mb-1">Est. Savings</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(finding.estimatedMonthlySavingsUsd)}/mo
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-xs text-zinc-500 mb-2">Evidence</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Metric:</span>{" "}
                      <span className="text-zinc-900 font-medium">{finding.evidence.metric}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Observed:</span>{" "}
                      <span className="text-zinc-900 font-medium">
                        {typeof finding.evidence.observed === "number"
                          ? formatCurrency(finding.evidence.observed)
                          : finding.evidence.observed}
                      </span>
                    </div>
                    {finding.evidence.expected !== undefined && (
                      <div>
                        <span className="text-zinc-500">Expected:</span>{" "}
                        <span className="text-zinc-900 font-medium">
                          {typeof finding.evidence.expected === "number"
                            ? formatCurrency(finding.evidence.expected)
                            : finding.evidence.expected}
                        </span>
                      </div>
                    )}
                    {finding.evidence.affectsToolIds && (
                      <div>
                        <span className="text-zinc-500">Tool:</span>{" "}
                        <span className="text-zinc-900 font-medium">
                          {finding.evidence.affectsToolIds.map(getToolName).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Capture */}
        <EmailCapture auditId={audit.id} isClaimed={isClaimed} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>Generated by Credex v{audit.engine_version}</p>
          <p className="mt-1">
            <Link href="/audit" className="text-blue-600 hover:text-blue-700">
              Run another audit
            </Link>
          </p>
        </div>
      </div>
    </div>
    </Suspense>
  );
}
