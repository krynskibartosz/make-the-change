-- Migration: P7 Leaderboard Refresh
-- Date: 2026-02-05
-- Description: Automates the refresh of public_user_rankings Materialized View via pg_cron

-- 1. Create Refresh Function
CREATE OR REPLACE FUNCTION public.refresh_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.public_user_rankings;
    -- Optional: Log refresh timestamp somewhere if needed, but not critical.
END;
$$;

-- 2. Schedule via pg_cron (if available)
-- Check if extension is active before scheduling
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Schedule to run every 30 minutes
        -- job name: 'refresh_leaderboard_job'
        PERFORM cron.schedule('refresh_leaderboard_job', '*/30 * * * *', 'SELECT public.refresh_leaderboard()');
    END IF;
END $$;
