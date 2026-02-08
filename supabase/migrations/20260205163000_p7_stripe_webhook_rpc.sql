-- Migration: P7 Stripe Strict Mode
-- Date: 2026-02-05
-- Description: Adds RPC for transactional, idempotent Stripe Payment Intent handling.

-- 1. Create Transactional Webhook RPC
CREATE OR REPLACE FUNCTION public.handle_payment_intent_succeeded(
    p_event_id text,
    p_payment_intent_id text,
    p_amount_cents integer,
    p_metadata jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, commerce, investment, pg_temp
AS $$
DECLARE
    v_order_type text;
    v_user_id uuid;
    v_reference_id uuid;
    v_points_used integer;
    v_investment_id uuid;
    v_order_id uuid;
    v_points_earned integer;
    v_result jsonb;
    v_existing_points_amount integer;
BEGIN
    -- 1. Idempotency Check
    IF EXISTS (SELECT 1 FROM commerce.stripe_events WHERE event_id = p_event_id AND processed_at IS NOT NULL) THEN
        RETURN jsonb_build_object('status', 'already_processed');
    END IF;

    -- Insert event if not exists (Locking)
    INSERT INTO commerce.stripe_events (event_id, type, data)
    VALUES (p_event_id, 'payment_intent.succeeded', p_metadata)
    ON CONFLICT (event_id) DO NOTHING;

    -- 2. Extract Metadata
    v_order_type := p_metadata->>'order_type';
    v_user_id := (p_metadata->>'user_id')::uuid;
    v_reference_id := (p_metadata->>'reference_id')::uuid;
    
    -- Validations
    IF v_user_id IS NULL OR v_reference_id IS NULL THEN
         UPDATE commerce.stripe_events SET error = 'Missing metadata', processed_at = now() WHERE event_id = p_event_id;
         RAISE EXCEPTION 'Invalid metadata: user_id or reference_id missing';
    END IF;

    -- 3. Logic Branch
    IF v_order_type = 'investment' THEN
        -- Verify Investment exists (and matches user)
        SELECT id, amount_points INTO v_investment_id, v_existing_points_amount 
        FROM investment.investments 
        WHERE id = v_reference_id AND user_id = v_user_id;
        
        IF v_investment_id IS NULL THEN
             UPDATE commerce.stripe_events SET error = 'Investment not found', processed_at = now() WHERE event_id = p_event_id;
             RAISE EXCEPTION 'Investment not found';
        END IF;

        -- Use existing calculated points if available, else fallback to standard logic
        v_points_earned := COALESCE(v_existing_points_amount, floor(p_amount_cents / 100));

        -- Update Investment
        UPDATE investment.investments 
        SET status = 'active', 
            stripe_payment_intent_id = p_payment_intent_id,
            updated_at = now()
        WHERE id = v_investment_id;

        -- Award Points (Ledger)
        PERFORM commerce.add_points(
            v_user_id, 
            v_points_earned, 
            'investment', 
            'investment', 
            v_investment_id, 
            jsonb_build_object('stripe_event_id', p_event_id)
        );

        v_result := jsonb_build_object('status', 'investment_activated', 'points_earned', v_points_earned);

    ELSIF v_order_type = 'product_purchase' THEN
        v_points_used := COALESCE((p_metadata->>'points_used')::int, 0);
        
        -- Verify Order
        SELECT id INTO v_order_id FROM commerce.orders WHERE id = v_reference_id AND user_id = v_user_id;
        IF v_order_id IS NULL THEN
             RAISE EXCEPTION 'Order not found';
        END IF;

        -- Deduct Points (if used)
        IF v_points_used > 0 THEN
             PERFORM commerce.add_points(
                v_user_id, 
                -v_points_used, 
                'purchase', 
                'order', 
                v_order_id, 
                jsonb_build_object('stripe_event_id', p_event_id)
            );
        END IF;
        
        -- Update Order Status
        UPDATE commerce.orders
        SET status = 'paid',
            stripe_payment_intent_id = p_payment_intent_id,
            updated_at = now()
        WHERE id = v_order_id;
        
        v_result := jsonb_build_object('status', 'order_paid', 'points_deducted', v_points_used);

    ELSE
        UPDATE commerce.stripe_events SET error = 'Unknown order_type', processed_at = now() WHERE event_id = p_event_id;
        RAISE EXCEPTION 'Unknown order_type: %', v_order_type;
    END IF;

    -- 4. Mark Processed
    UPDATE commerce.stripe_events 
    SET processed_at = now(), error = NULL 
    WHERE event_id = p_event_id;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    -- Capture error
    UPDATE commerce.stripe_events 
    SET error = SQLERRM 
    WHERE event_id = p_event_id;
    RAISE; -- Re-throw to let Stripe retry
END;
$$;
