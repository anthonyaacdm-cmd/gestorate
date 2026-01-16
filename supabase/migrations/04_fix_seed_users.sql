
-- Fix seed users insertion to handle existing emails properly
-- Replaces previous logic that caused duplicate key violations by using ON CONFLICT (email)

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Handle Anthony.aacdm@gmail.com
  -- Retrieve the correct UUID from auth.users to ensure consistency
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'Anthony.aacdm@gmail.com';
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_user_id, 'Anthony.aacdm@gmail.com', 'Anthony', 'master')
    ON CONFLICT (email) DO UPDATE SET
      role = EXCLUDED.role,
      name = EXCLUDED.name,
      updated_at = CURRENT_TIMESTAMP;
  END IF;

  -- Note: This pattern prevents errors when the email already exists but the ID might be different 
  -- (though ID should match auth.users). It replaces the need for a separate UPDATE statement.
END $$;
