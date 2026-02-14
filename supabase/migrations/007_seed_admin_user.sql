-- This migration creates the initial admin user.
-- In production, you should create the admin user via Supabase dashboard
-- and then update their role using a separate script.

-- Function to promote a user to admin role
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = user_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on promote_to_admin to authenticated users
GRANT EXECUTE ON FUNCTION public.promote_to_admin(UUID) TO authenticated;

-- Note: To create the initial admin user:
-- 1. Sign up a user through your app or Supabase dashboard
-- 2. Get their user ID from auth.users
-- 3. Run: SELECT public.promote_to_admin('your-user-id-here');
-- 4. Or manually update: UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id';

-- For development, you can use the environment variable approach:
-- Get the admin email from env and create/update the user
-- This would typically be done in a seed script, not migrations

-- Alternative: Create a stored procedure for initial admin setup
CREATE OR REPLACE FUNCTION public.ensure_admin_user()
RETURNS UUID AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user exists (you'd typically look up by email)
  -- For now, this is a placeholder that needs to be called with proper parameters

  -- In a real setup, you would:
  -- 1. Check if a user with a specific admin email exists
  -- 2. If not, create them in auth.users
  -- 3. Ensure they have admin role in profiles

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
