import { NextResponse } from "next/server";
import { createClientClient } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClientClient();

  const { data: audit } = await supabase
    .from("audits")
    .select("result, savings_usd")
    .eq("id", id)
    .single();

  if (!audit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { result } = audit as {
    result: {
      totalMonthlySpendUsd: number;
      totalMonthlySavingsUsd: number;
      savingsPct: number;
      findings: { length: number };
    };
  };

  const savings = result.totalMonthlySavingsUsd.toFixed(0);
  const spend = result.totalMonthlySpendUsd.toFixed(0);
  const percent = result.savingsPct;

  // Generate simple SVG OG image
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" />

      <text x="60" y="80" font-family="system-ui, sans-serif" font-size="32" fill="#9ca3af">
        Credex AI Spend Audit
      </text>

      <text x="60" y="200" font-family="system-ui, sans-serif" font-size="48" fill="#f3f4f6">
        Save $${savings}/mo on AI Tools
      </text>

      <text x="60" y="280" font-family="system-ui, sans-serif" font-size="28" fill="#9ca3af">
        Current spend: $${spend}/mo • ${percent}% savings
      </text>

      <text x="60" y="400" font-family="system-ui, sans-serif" font-size="24" fill="#10b981">
        ✓ ${result.findings.length} optimization opportunity${result.findings.length === 1 ? "" : "ies"} found
      </text>

      <rect x="60" y="480" width="200" height="60" rx="8" fill="#2563eb" />
      <text x="160" y="520" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">
        View Report
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
