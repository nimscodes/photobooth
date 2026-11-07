begin;

-- Keep these tables available to the server-side service role only.
-- Public app requests go through validated Next.js route handlers instead
-- of accessing the tables directly through the Supabase Data API.
alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.gallery_photos enable row level security;

revoke all privileges on table public.bookings from public, anon, authenticated;
revoke all privileges on table public.blocked_dates from public, anon, authenticated;
revoke all privileges on table public.gallery_photos from public, anon, authenticated;

grant select, insert, update on table public.bookings to service_role;
grant select, insert, delete on table public.blocked_dates to service_role;
grant select, insert, delete on table public.gallery_photos to service_role;

commit;
