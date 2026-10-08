-- Citizen of PE Metro Portal - Supabase schema
-- Run this entire file in Supabase SQL Editor.

create table if not exists public.portal_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_state enable row level security;

drop policy if exists "Portal state is publicly readable" on public.portal_state;
create policy "Portal state is publicly readable"
  on public.portal_state for select
  to anon, authenticated
  using (true);

drop policy if exists "Portal state can be written by portal clients" on public.portal_state;
create policy "Portal state can be written by portal clients"
  on public.portal_state for insert
  to anon, authenticated
  with check (id = 'main');

drop policy if exists "Portal state can be updated by portal clients" on public.portal_state;
create policy "Portal state can be updated by portal clients"
  on public.portal_state for update
  to anon, authenticated
  using (id = 'main')
  with check (id = 'main');

create index if not exists portal_state_updated_at_idx
  on public.portal_state (updated_at desc);

insert into public.portal_state (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Image bucket used by the portal upload components.
insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Community images are publicly readable" on storage.objects;
create policy "Community images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'community-images');

drop policy if exists "Community images can be uploaded" on storage.objects;
create policy "Community images can be uploaded"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'community-images');

drop policy if exists "Community images can be updated" on storage.objects;
create policy "Community images can be updated"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'community-images')
  with check (bucket_id = 'community-images');

drop policy if exists "Community images can be deleted" on storage.objects;
create policy "Community images can be deleted"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'community-images');
