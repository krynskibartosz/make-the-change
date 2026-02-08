-- Phase 0: Pre-Audit / Sanity Check
-- Run this in Supabase SQL Editor to capture the current "As-Is" State.

-- 1. Check for table existence
SELECT to_regclass('commerce.points_ledger') as points_ledger_exists;
SELECT to_regclass('commerce.stripe_events') as stripe_events_exists;
SELECT to_regclass('public.producer_messages') as producer_messages_exists;

-- 2. Extract Schema Definitions (if they exist)
-- Copy/Paste the output of these to the chat or save to a file.

select 
    'commerce.points_ledger' as table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
from information_schema.columns 
where table_schema = 'commerce' and table_name = 'points_ledger'
ORDER BY ordinal_position;

select 
     'commerce.stripe_events' as table_name,
    column_name, 
    data_type, 
    is_nullable
from information_schema.columns 
where table_schema = 'commerce' and table_name = 'stripe_events'
ORDER BY ordinal_position;

select 
     'public.producer_messages' as table_name,
    column_name, 
    data_type, 
    is_nullable
from information_schema.columns 
where table_schema = 'public' and table_name = 'producer_messages'
ORDER BY ordinal_position;

-- 3. Check for Existing Functions (add_points)
-- This returns the CREATE FUNCTION sql.
select pg_get_functiondef(oid) 
from pg_proc 
where proname = 'add_points';

-- 4. Check for Existing Views
select pg_get_viewdef('public.public_user_profiles', true) as public_profs_def;
select pg_get_viewdef('public.public_user_rankings', true) as public_ranks_def;
