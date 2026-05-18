-- Run in Supabase SQL Editor (after creating a project).
-- Enables sign-up / sign-in and per-user app data for RECOMP + BLOOM.

create table if not exists public.app_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  app_id text not null check (app_id in ('recomp-zakeer', 'recomp-aadila')),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, app_id)
);

alter table public.app_state enable row level security;

create policy "Users read own app state"
  on public.app_state for select
  using (auth.uid() = user_id);

create policy "Users insert own app state"
  on public.app_state for insert
  with check (auth.uid() = user_id);

create policy "Users update own app state"
  on public.app_state for update
  using (auth.uid() = user_id);

create index if not exists app_state_user_id_idx on public.app_state (user_id);
