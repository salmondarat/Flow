-- Migration: Add client INSERT policies for orders and order_items
-- This allows clients to create their own orders and order items

-- ============================================
-- 1. Allow clients to insert orders (for themselves)
-- ============================================

DROP POLICY IF EXISTS "Clients can insert own orders" ON public.orders;
CREATE POLICY "Clients can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- ============================================
-- 2. Allow clients to insert order_items (for their own orders)
-- ============================================

DROP POLICY IF EXISTS "Clients can insert own order_items" ON public.order_items;
CREATE POLICY "Clients can insert own order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()
    )
  );
