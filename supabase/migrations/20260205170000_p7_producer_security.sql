-- Migration: P7 Producer Messaging Security
-- Date: 2026-02-05
-- Description: Secures producer messages via RLS and adds sender snapshotting.

-- 1. Enable RLS
ALTER TABLE public.producer_messages ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Senders can only insert their own messages
-- Note: 'sender_user_id' is checked against auth.uid()
CREATE POLICY "Users can create messages"
ON public.producer_messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_user_id = auth.uid()
);

-- 3. Policy: Senders can view their own messages
CREATE POLICY "Users can view own messages"
ON public.producer_messages
FOR SELECT
TO authenticated
USING (
    sender_user_id = auth.uid()
);

-- 4. Policy: Producers (owners) can view messages (JOIN with producers using RLS)
-- Assuming 'producers' table has owner_user_id and is secured or we join here.
-- Performance note: EXISTS subquery is standard for this.
CREATE POLICY "Producers can view received messages"
ON public.producer_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM investment.producers p
        WHERE p.id = producer_messages.producer_id
        AND p.owner_user_id = auth.uid()
    )
);

-- 5. Trigger: Snapshot Sender Details (Privacy & Integrity)
-- Avoids needing to join with profiles later if profile changes/deleted.
CREATE OR REPLACE FUNCTION public.snapshot_message_sender()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
DECLARE
    v_name text;
    v_email text;
BEGIN
    SELECT 
        COALESCE(first_name || ' ' || last_name, 'Anonyme'),
        email
    INTO v_name, v_email
    FROM public.profiles
    WHERE id = NEW.sender_user_id;

    NEW.metadata = jsonb_set(
        COALESCE(NEW.metadata, '{}'::jsonb),
        '{sender_snapshot}',
        jsonb_build_object(
            'name', v_name,
            'email', v_email,
            'at', now()
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_snapshot_message_sender ON public.producer_messages;
CREATE TRIGGER trg_snapshot_message_sender
BEFORE INSERT ON public.producer_messages
FOR EACH ROW
EXECUTE FUNCTION public.snapshot_message_sender();
