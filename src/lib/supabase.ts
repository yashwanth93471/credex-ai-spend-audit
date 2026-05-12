import { createClient } from "@supabase/supabase-js";
import { serverEnv, clientEnv } from "./env";

/**
 * Server-side Supabase client with service role.
 * Use for writes (lead creation, audit updates).
 * Must only be called from server components or route handlers.
 */
export function createServerClient() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = serverEnv();
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Client-side Supabase client with anon key.
 * Use for reads only (report viewing).
 */
export function createClientClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = clientEnv();
  return createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Row types matching the schema in supabase/migrations/001_init.sql
export type LeadRow = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  audits_count: number;
  first_seen: string;
  last_seen: string;
};

export type AuditRow = {
  id: string;
  lead_id: string | null;
  inputs: unknown;
  result: unknown;
  summary: string;
  summary_source: "llm" | "fallback";
  savings_usd: number;
  engine_version: string;
  created_at: string;
  claimed_at: string | null;
};
