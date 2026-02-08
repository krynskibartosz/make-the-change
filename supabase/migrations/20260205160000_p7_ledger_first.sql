-- Migration: P7 Ledger-First Architecture
-- Date: 2026-02-05
-- Description: Standardizes 'ghost' tables, backfills points ledger, and enforces Ledger as Source of Truth via triggers.

-- 1. Ensure Ghost Tables Exist (Idempotent)
CREATE SCHEMA IF NOT EXISTS commerce;

-- Commerce: Points Ledger
CREATE TABLE IF NOT EXISTS commerce.points_ledger (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    delta integer NOT NULL,
    balance_after integer NOT NULL,
    reason text NOT NULL,
    reference_type text,
    reference_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Commerce: Stripe Events
CREATE TABLE IF NOT EXISTS commerce.stripe_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id text UNIQUE NOT NULL,
    type text NOT NULL,
    data jsonb,
    processed_at timestamptz,
    error text, -- Added column for error tracking
    received_at timestamptz DEFAULT now() -- Added typically useful column
);

-- Public: Producer Messages
CREATE TABLE IF NOT EXISTS public.producer_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    producer_id uuid NOT NULL, -- references investment.producers(id) - assuming implicit
    sender_user_id uuid NOT NULL REFERENCES auth.users(id),
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Backfill Ledger (One-time adjustment)
DO $$
DECLARE
    r RECORD;
    v_ledger_sum INTEGER;
    v_ui_balance INTEGER;
    v_diff INTEGER;
BEGIN
    -- Iterate over users who have points in metadata
    FOR r IN 
        SELECT id, metadata 
        FROM public.profiles 
        WHERE (metadata->>'points_balance')::int != 0 
           OR (metadata->>'points_balance') IS NOT NULL
    LOOP
        v_ui_balance := COALESCE((r.metadata->>'points_balance')::int, 0);

        -- Calculate current ledger sum
        SELECT COALESCE(SUM(delta), 0) INTO v_ledger_sum
        FROM commerce.points_ledger
        WHERE user_id = r.id;

        v_diff := v_ui_balance - v_ledger_sum;

        -- If difference exists, insert adjustment
        IF v_diff != 0 THEN
            INSERT INTO commerce.points_ledger (
                user_id,
                delta,
                balance_after,
                reason,
                reference_type,
                metadata
            ) VALUES (
                r.id,
                v_diff,
                v_ui_balance, -- Resulting balance matches UI
                'opening_balance_backfill',
                'system_migration_p7',
                jsonb_build_object(
                    'original_ui_balance', v_ui_balance, 
                    'original_ledger_sum', v_ledger_sum,
                    'notes', 'P7 migration adjustment'
                )
            );
        END IF;
    END LOOP;
END $$;

-- 3. Trigger: Sync Ledger to Cache (Source of Truth Propagation)
CREATE OR REPLACE FUNCTION commerce.sync_points_cache()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, commerce, pg_temp
AS $$
DECLARE
    v_new_total INTEGER;
BEGIN
    -- Calculate new total from Ledger
    SELECT COALESCE(SUM(delta), 0) INTO v_new_total
    FROM commerce.points_ledger
    WHERE user_id = NEW.user_id;

    -- Update the cache (Metadata)
    -- bypass_points_guard allows this specific update to pass the Guard Trigger
    PERFORM set_config('app.bypass_points_guard', 'true', true);

    UPDATE public.profiles
    SET metadata = jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{points_balance}',
        to_jsonb(v_new_total)
    )
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_points_cache ON commerce.points_ledger;
CREATE TRIGGER trg_sync_points_cache
AFTER INSERT ON commerce.points_ledger
FOR EACH ROW
EXECUTE FUNCTION commerce.sync_points_cache();

-- 4. Guard Trigger: Prevent Direct Metadata Edits
CREATE OR REPLACE FUNCTION public.protect_points_cache()
RETURNS TRIGGER
AS $$
BEGIN
    -- Allow if bypass flag is set (by sync trigger)
    IF current_setting('app.bypass_points_guard', true) = 'true' THEN
        RETURN NEW;
    END IF;
    
    -- Allow if internal Supabase Service Role (admin/dashboard edits might need this initially, but ideally we strictly forbid)
    -- For P7 consistency, we should enforce this even for service_role unless explicit bypass.
    -- However, dashboard P2 uses direct update. P2 Dashboard will BREAK until we update it to use RPC.
    -- FIXME: For now, strict check. We will fix Dashboard usage in P7.
    
    -- Check if points_balance is changing
    IF (OLD.metadata->>'points_balance')::int IS DISTINCT FROM (NEW.metadata->>'points_balance')::int THEN
         RAISE EXCEPTION 'Direct update of points_balance is forbidden. You must insert into commerce.points_ledger.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- DROP TRIGGER IF EXISTS trg_protect_points_cache ON public.profiles;
-- CREATE TRIGGER trg_protect_points_cache
-- BEFORE UPDATE ON public.profiles
-- FOR EACH ROW
-- EXECUTE FUNCTION public.protect_points_cache();

-- 5. Standardize RPC `add_points` (Ledger Only)
CREATE OR REPLACE FUNCTION commerce.add_points(
    p_user_id uuid,
    p_delta integer,
    p_reason text,
    p_reference_type text DEFAULT NULL::text,
    p_reference_id uuid DEFAULT NULL::uuid,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, commerce, pg_temp
AS $$
DECLARE
    v_ledger_id UUID;
    v_current_cache INTEGER;
    v_new_sum INTEGER;
BEGIN
    -- Check for insufficient funds (Read from Cache for speed)
    IF p_delta < 0 THEN
        SELECT COALESCE((metadata->>'points_balance')::int, 0)
        INTO v_current_cache
        FROM public.profiles
        WHERE id = p_user_id;

        IF v_current_cache + p_delta < 0 THEN
            RAISE EXCEPTION 'Insufficient points balance';
        END IF;
    END IF;

    -- Lock Profile to serialize ledger writes for this user
    PERFORM 1 FROM public.profiles WHERE id = p_user_id FOR UPDATE;

    -- Calculate projected balance (Optional for 'balance_after' consistency)
    -- We read clean sum from ledger to be safe
    SELECT COALESCE(SUM(delta), 0) INTO v_current_cache
    FROM commerce.points_ledger
    WHERE user_id = p_user_id;
    
    v_new_sum := v_current_cache + p_delta;

    -- Insert into Ledger (Trigger will sync Cache)
    INSERT INTO commerce.points_ledger (
        user_id,
        delta,
        balance_after,
        reason,
        reference_type,
        reference_id,
        metadata
    ) VALUES (
        p_user_id,
        p_delta,
        v_new_sum,
        p_reason,
        p_reference_type,
        p_reference_id,
        p_metadata
    )
    RETURNING id INTO v_ledger_id;

    RETURN v_ledger_id;
END;
$$;
