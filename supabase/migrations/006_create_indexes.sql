-- Create indexes for common query patterns

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Change requests indexes
CREATE INDEX IF NOT EXISTS idx_change_requests_order_id ON public.change_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON public.change_requests(status);

-- Progress logs indexes
CREATE INDEX IF NOT EXISTS idx_progress_logs_order_id ON public.progress_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON public.progress_logs(created_at DESC);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
