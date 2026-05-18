-- Run once on an existing Supabase project (after the original schema).
-- Merges legacy per-theme rows into the shared `fitness` app_id.

-- Allow `fitness` in app_id (skip if you already ran the updated schema.sql).
alter table public.app_state drop constraint if exists app_state_app_id_check;
alter table public.app_state
  add constraint app_state_app_id_check
  check (app_id in ('fitness', 'recomp-zakeer', 'recomp-aadila'));

-- Copy newer legacy row into fitness when fitness is missing.
insert into public.app_state (user_id, app_id, state, updated_at)
select distinct on (user_id)
  user_id,
  'fitness',
  state,
  updated_at
from public.app_state
where app_id in ('recomp-zakeer', 'recomp-aadila')
  and not exists (
    select 1
    from public.app_state f
    where f.user_id = app_state.user_id
      and f.app_id = 'fitness'
  )
order by user_id, updated_at desc;
