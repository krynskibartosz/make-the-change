-- Migration: P7 Points Checkout RPC (Atomic)
-- Date: 2026-02-06
-- Description: Adds a transactional RPC to place points-based orders with stock decrementation and ledger write.

CREATE OR REPLACE FUNCTION public.place_points_order(
  p_items jsonb,
  p_shipping_address jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, commerce, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_order_id uuid;
  v_total_points integer := 0;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_unit_price integer;
  v_stock_quantity integer;
  v_product record;
  v_image_url text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'CART_INVALID';
  END IF;

  IF p_shipping_address IS NULL OR jsonb_typeof(p_shipping_address) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'CART_INVALID';
  END IF;

  PERFORM 1 FROM public.profiles WHERE id = v_user_id FOR UPDATE;

  FOR v_item IN SELECT jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_quantity := (v_item->>'quantity')::int;

    IF v_product_id IS NULL OR v_quantity IS NULL OR v_quantity < 1 OR v_quantity > 20 THEN
      RAISE EXCEPTION 'CART_INVALID';
    END IF;

    SELECT
      id,
      slug,
      name_default,
      price_points,
      stock_quantity,
      fulfillment_method,
      metadata
    INTO v_product
    FROM public.products
    WHERE id = v_product_id AND is_active = true
    FOR UPDATE;

    IF v_product.id IS NULL THEN
      RAISE EXCEPTION 'CART_INVALID';
    END IF;

    v_unit_price := COALESCE(v_product.price_points::int, 0);
    v_stock_quantity := CASE WHEN v_product.stock_quantity IS NULL THEN NULL ELSE v_product.stock_quantity::int END;

    IF v_stock_quantity IS NOT NULL AND v_quantity > GREATEST(v_stock_quantity, 0) THEN
      RAISE EXCEPTION 'OUT_OF_STOCK';
    END IF;

    v_total_points := v_total_points + (v_unit_price * v_quantity);
  END LOOP;

  INSERT INTO public.orders (
    user_id,
    status,
    subtotal_points,
    shipping_cost_points,
    tax_points,
    total_points,
    points_used,
    points_earned,
    payment_method,
    shipping_address
  ) VALUES (
    v_user_id,
    'paid',
    v_total_points,
    0,
    0,
    v_total_points,
    v_total_points,
    0,
    'points',
    p_shipping_address
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_quantity := (v_item->>'quantity')::int;

    SELECT
      id,
      slug,
      name_default,
      price_points,
      stock_quantity,
      fulfillment_method,
      metadata
    INTO v_product
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    v_unit_price := COALESCE(v_product.price_points::int, 0);

    v_image_url :=
      COALESCE(
        v_product.metadata->>'image_url',
        (v_product.metadata->'images'->>0),
        NULL
      );

    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      unit_price_points,
      total_price_points,
      product_snapshot
    ) VALUES (
      v_order_id,
      v_product_id,
      v_quantity,
      v_unit_price,
      v_unit_price * v_quantity,
      jsonb_build_object(
        'name', v_product.name_default,
        'slug', v_product.slug,
        'pricePoints', v_unit_price,
        'imageUrl', v_image_url,
        'fulfillmentMethod', v_product.fulfillment_method
      )
    );

    IF v_product.stock_quantity IS NOT NULL THEN
      UPDATE public.products
      SET stock_quantity = GREATEST(0, stock_quantity - v_quantity),
          updated_at = now()
      WHERE id = v_product_id;
    END IF;
  END LOOP;

  PERFORM commerce.add_points(
    v_user_id,
    -v_total_points,
    'purchase',
    'order',
    v_order_id,
    jsonb_build_object('payment_method', 'points')
  );

  RETURN jsonb_build_object('orderId', v_order_id, 'totalPoints', v_total_points);
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_points_order(jsonb, jsonb) TO authenticated;

