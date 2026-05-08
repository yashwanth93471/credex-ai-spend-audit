-- Credex initial schema (applied on Day 3 when the form lands).
--
-- Two tables:
--   leads   — deduped by email; the lead-gen primary record
--   audits  — the audit artifact, can exist with NO email (anonymous)
--
-- Lifecycle:
--   1. createAudit  → INSERT into audits with lead_id NULL
--   2. claimAudit   → UPSERT leads, UPDATE audits SET lead_id, claimed_at

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text,
  company       text,
  role          text,
  audits_count  int  not null default 1,
  first_seen    timestamptz not null default now(),
  last_seen     timestamptz not null default now()
);

create table if not exists public.audits (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid references public.leads(id) on delete set null,
  inputs          jsonb not null,
  result          jsonb not null,
  summary         text  not null,
  summary_source  text  not null check (summary_source in ('llm', 'fallback')),
  savings_usd     numeric(10, 2) not null,
  engine_version  text  not null,
  created_at      timestamptz not null default now(),
  claimed_at      timestamptz
);

create index if not exists audits_lead_idx    on public.audits (lead_id);
create index if not exists audits_created_idx on public.audits (created_at desc);
create index if not exists audits_savings_idx on public.audits (savings_usd desc);

alter table public.leads  enable row level security;
alter table public.audits enable row level security;

-- Anonymous can create audits (the form is public; no auth).
create policy if not exists audits_insert_anon
  on public.audits for insert to anon
  with check (true);

-- Anyone with the audit ID can read it (shareable links).
create policy if not exists audits_select_anon
  on public.audits for select to anon
  using (true);

-- leads: NO anon policies. All writes happen server-side via the service role.
