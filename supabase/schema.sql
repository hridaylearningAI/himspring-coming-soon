-- Blog schema. Paste this into the Supabase SQL editor once (Dashboard →
-- SQL Editor → New query → Run). It is idempotent, so re-running it is safe.
--
-- The site never writes with the secret key: every read goes through the
-- publishable key and row-level security decides what comes back. That is why
-- "published" is not a boolean — a null published_at is a draft, a past one is
-- live, and a future one is scheduled, all under a single policy.

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  cover_url    text,
  cover_alt    text,
  body         text not null default '',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc nulls last);

alter table public.posts enable row level security;

drop policy if exists "posts are public once published" on public.posts;
create policy "posts are public once published"
  on public.posts for select
  using (published_at is not null and published_at <= now());

-- Editors are the company, not merely whoever is signed in.
--
-- "to authenticated" alone would be a hole: Supabase leaves email signup on by
-- default, so anyone holding the publishable key — which ships in the public
-- site — could create an account and inherit write access. An @himspring.com
-- address closes it, with two conditions on how it is checked:
--
--   * The address is read from auth.users, not from the session token. A token
--     carries user_metadata the user can rewrite themselves; the users table is
--     the only copy Supabase owns.
--   * email_confirmed_at must be set, so the address has to have been received.
--     Without that line, "Confirm email" being turned off in the dashboard
--     would let anyone sign up as anything@himspring.com and start publishing.
--
-- security definer is what lets a policy read auth.users at all — the
-- authenticated role has no grant on it. The function only ever answers about
-- the caller's own row, so it leaks nothing.
create or replace function public.is_editor() returns boolean
  language sql stable security definer set search_path = public, auth as $$
    select exists (
      select 1 from auth.users u
       where u.id = auth.uid()
         and u.email_confirmed_at is not null
         and split_part(u.email, '@', 2) = 'himspring.com'
    );
  $$;

revoke execute on function public.is_editor() from public, anon;
grant execute on function public.is_editor() to authenticated;

drop policy if exists "editors manage posts" on public.posts;
create policy "editors manage posts"
  on public.posts for all to authenticated
  using (public.is_editor())
  with check (public.is_editor());


-- ---- images ----------------------------------------------------------------
-- One public bucket. Public means readable by URL, not writable: the policies
-- below still gate every upload behind a session.

insert into storage.buckets (id, name, public)
  values ('blog', 'blog', true)
  on conflict (id) do update set public = true;

drop policy if exists "blog images are public" on storage.objects;
create policy "blog images are public"
  on storage.objects for select
  using (bucket_id = 'blog');

drop policy if exists "editors manage blog images" on storage.objects;
create policy "editors manage blog images"
  on storage.objects for all to authenticated
  using (bucket_id = 'blog' and public.is_editor())
  with check (bucket_id = 'blog' and public.is_editor());


-- ---- did it take? ----------------------------------------------------------
-- Prints the rule as the database now holds it, and who currently passes it. A
-- save denied with "new row violates row-level security policy" after running
-- this means the account you are signed in as is not in the second list.
select polname as policy, pg_get_expr(polwithcheck, polrelid) as with_check
  from pg_policy
 where polrelid in ('public.posts'::regclass, 'storage.objects'::regclass)
   and polname like '%editors%';

select email, email_confirmed_at is not null as confirmed
  from auth.users
 where split_part(email, '@', 2) = 'himspring.com'
 order by email;
