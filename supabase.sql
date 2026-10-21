-- In Supabase: SQL Editor → New query → gesamten Inhalt ausführen.
create table if not exists public.bma_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bma_state enable row level security;

-- Öffentlicher Demo-Zugriff: erforderlich, weil der Chef-Login nur im Website-Code liegt.
-- NICHT für vertrauliche/produktive Daten verwenden. Jeder mit dem öffentlichen Website-Key
-- kann den gemeinsamen Datensatz lesen und verändern.
drop policy if exists "bma_state_public_read" on public.bma_state;
drop policy if exists "bma_state_public_write" on public.bma_state;
create policy "bma_state_public_read" on public.bma_state for select to anon, authenticated using (true);
create policy "bma_state_public_write" on public.bma_state for all to anon, authenticated using (true) with check (true);

grant select, insert, update, delete on public.bma_state to anon, authenticated;

-- Echtzeitänderungen aktivieren (falls noch nicht in der Publication enthalten).
alter publication supabase_realtime add table public.bma_state;
