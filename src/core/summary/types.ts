import type { AuditResult } from "../audit/types";

export type SummarySource = "llm" | "fallback";

export interface GenerateSummaryResult {
  summary: string;
  source: SummarySource;
}

export interface SummaryInput {
  result: AuditResult;
  teamSize: number;
  primaryUseCase: string;
}
