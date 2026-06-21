"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AuditResult } from "@/core/audit/types";
import { AuditReportView } from "@/components/audit-report-view";

type FallbackAudit = {
  result: AuditResult;
  summary: string;
  summarySource: "llm" | "fallback";
};

export default function AuditPreviewPage() {
  const [audit, setAudit] = useState<FallbackAudit | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("audit-fallback");
      if (!raw) {
        setMissing(true);
        return;
      }
      sessionStorage.removeItem("audit-fallback");
      setAudit(JSON.parse(raw) as FallbackAudit);
    } catch {
      setMissing(true);
    }
  }, []);

  if (missing) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-600 mb-4">No audit data found. Results are only held for one page load.</p>
          <Link href="/audit" className="text-blue-600 hover:text-blue-700 font-medium">
            Run a new audit
          </Link>
        </div>
      </div>
    );
  }

  if (!audit) {
    return null;
  }

  return (
    <AuditReportView
      result={audit.result}
      summary={audit.summary}
      summarySource={audit.summarySource}
      engineVersion={audit.result.engineVersion}
      persistenceFailed
    />
  );
}
