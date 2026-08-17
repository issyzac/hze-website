
# Supabase Integration Setup

I have updated your application to use Supabase for handling subscriptions, orders, AND events.

## 1. Environment Variables

You need to connect your frontend to your Supabase project.

1.  Create a file named `.env` in the root of your project (same level as `package.json`).
2.  Add your Supabase URL and Anonymous Key to it. You can find these in your Supabase Dashboard under **Project Settings > API**.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Schema

You need to create tables in Supabase to store the data. Run the following SQL query in your Supabase **SQL Editor**:

```sql
-- 1. Create the SUBSCRIPTIONS table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cups_range text,
  custom_cups numeric,
  brew_method text,
  grind_pref text,
  coffee_product text,
  schedule text,
  recommended_size text,
  calculated_price text,
  full_name text not null,
  email text not null,
  phone text
);

-- 2. Create the ORDERS table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_name text,
  quantity numeric,
  note text,
  full_name text not null,
  email text,
  phone text
);

-- 3. Create the EVENTS table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  date date not null, -- Stores date in YYYY-MM-DD format
  time text,             -- e.g. "2:00 PM - 5:00 PM"
  description text,
  location text,
  type text,             -- 'tasting', 'workshop', 'gathering'
  registration_link text
);

-- Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.events enable row level security;

-- Policies for SUBSCRIPTIONS & ORDERS (Public Write)
create policy "Enable insert for everyone" on public.subscriptions for insert to anon with check (true);
create policy "Enable insert for everyone" on public.orders for insert to anon with check (true);

-- Policies for EVENTS (Public Read Only)
-- Anyone can view events, but only admins (via dashboard) can add them
create policy "Enable read for everyone" on public.events for select to anon using (true);
```

## 2b. Job Applications table (Careers page)

The barista application on `#/careers` writes to `job_applications`. Run this once:

```sql
create table public.job_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  role text not null default 'Barista',
  full_name text,
  email text,
  phone text,
  area text,
  preferred_location text,
  experience_level text,
  earliest_start text,
  notice_period text,
  salary_expectation text,
  completion_percent integer,
  answers jsonb not null,          -- { raw: {...}, readable: [{n, id, section, question, answer}] }
  status text default 'new'        -- for your own shortlisting: new / shortlisted / interviewed / hired / declined
);

alter table public.job_applications enable row level security;

-- Applicants may submit, but nobody anonymous may read applications back.
create policy "Enable insert for everyone" on public.job_applications
  for insert to anon, authenticated with check (true);
```

> **Do not chain `.select()` onto this insert.** Because there is deliberately no
> SELECT policy, `.insert(...).select()` makes PostgREST run an
> `INSERT ... RETURNING`, whose read-back RLS check fails and rolls the whole
> statement back. Postgres reports it as
> `new row violates row-level security policy for table "job_applications"`,
> which reads like the *insert* was refused when only the *return* was — a
> genuinely misleading error. `src/hooks/useJobApplication.ts` inserts without
> `.select()` for this reason. The same applies to any other insert-only table.

Read applications in the Supabase dashboard (Table Editor), or with SQL:

```sql
select created_at, full_name, phone, email, preferred_location, experience_level, salary_expectation
from public.job_applications
order by created_at desc;
```

To read one full application:

```sql
select jsonb_pretty(answers -> 'readable') from public.job_applications where id = '<uuid>';
```

## 3. Seed Initial Events (Optional)

You can run this SQL to pre-fill your database with the current events:

```sql
insert into public.events (title, date, time, description, location, type, registration_link)
values 
  ('Sip and Paint', '2026-02-14', '2:00 PM - 5:00 PM', 'Unleash your inner artist while enjoying our finest selection of brews. A perfect blend of creativity and relaxation.', 'HZE Mbezi', 'gathering', 'https://forms.gle/LfzsSktYhZfRtNMw8'),
  ('Book Swap Event', '2026-02-21', '10:00 AM - 1:00 PM', 'Bring a book, take a book. Join fellow book lovers for a morning of literary exchange and community conversation.', 'HZE Mbezi', 'gathering', null),
  ('Brew Better at Home', '2026-02-28', '1:45 PM - 4:00 PM', 'Elevate your morning ritual. Learn expert techniques for pour-over, french press, and troubleshooting your home brew.', 'HZE Mbezi', 'workshop', 'https://forms.gle/j6XEQ9fqP8mP244h6');
```

## 4. Verify Integration

1.  Restart your development server.
2.  Refresh the page. The events section should now be pulling data from your Supabase database!
