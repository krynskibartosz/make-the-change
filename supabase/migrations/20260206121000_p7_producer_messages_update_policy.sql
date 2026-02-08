CREATE POLICY "Producers can update received messages"
ON public.producer_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM investment.producers p
    WHERE p.id = producer_messages.producer_id
      AND p.owner_user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM investment.producers p
    WHERE p.id = producer_messages.producer_id
      AND p.owner_user_id = auth.uid()
  )
);

