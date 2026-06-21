import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClientClient } from "@/lib/supabase";
import type { AuditResult } from "@/core/audit/types";
import { AuditReportView } from "@/components/audit-report-view";
import { LoadingPage } from "@/components/ui/loading";

type AuditRecord = {
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

  return data as AuditRecord;
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

  return (
    <Suspense fallback={<LoadingPage />}>
      <AuditReportView
        result={audit.result}
        summary={audit.summary}
        summarySource={audit.summary_source}
        engineVersion={audit.engine_version}
        createdAt={audit.created_at}
        auditId={audit.id}
        isClaimed={audit.claimed_at !== null}
      />
    </Suspense>
  );
}
