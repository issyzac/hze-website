
# Supabase Integration Setup

I have updated your application to use Supabase for handling subscriptions AND orders instead of the previous API endpoints.

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
  
  -- Subscription Details
  cups_range text,
  custom_cups numeric,
  brew_method text,
  grind_pref text,
  coffee_product text,
  schedule text,
  recommended_size text,
  calculated_price text,
  
  -- Contact Info
  full_name text not null,
  email text not null,
  phone text
);

-- 2. Create the ORDERS table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Order Details
  product_name text,
  quantity numeric,
  note text,
  
  -- Contact Info
  full_name text not null,
  email text,
  phone text
);

-- Enable Row Level Security (RLS) for both
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;

-- Create policies to allow anyone (anon) to insert data
create policy "Enable insert for everyone" on public.subscriptions for insert to anon with check (true);
create policy "Enable insert for everyone" on public.orders for insert to anon with check (true);

-- Create policies to allow reading only by authenticated users (optional, for admin dashboard)
create policy "Enable read access for authenticated users only" on public.subscriptions for select to authenticated using (true);
create policy "Enable read access for authenticated users only" on public.orders for select to authenticated using (true);
```

## 3. Verify Integration

1.  Restart your development server (`npm run dev`) to ensure the new environment variables are loaded.
2.  Open the Subscription Wizard or Order Form on your site.
3.  Fill out the forms and submit.
4.  Check your Supabase Table Editor; you should see new records in the `subscriptions` and `orders` tables.
