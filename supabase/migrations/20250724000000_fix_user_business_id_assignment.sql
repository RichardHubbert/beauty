-- Fix user business_id assignment in handle_new_user trigger
-- This migration updates the handle_new_user function to assign the correct business_id
-- when creating new user profiles

-- Update the handle_new_user function to include business_id assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the Bond Chauffeur business ID
  -- Using the correct business ID for Bond Chauffeur
  INSERT INTO profiles (user_id, full_name, company_name, role, business_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    'user',
    '6c5d19b9-e75c-48e6-a894-ca33882a0304' -- Bond Chauffeur business ID
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No need to recreate the trigger as it already exists and points to the function
-- which we've just updated

-- Update any existing profiles that have NULL business_id
UPDATE profiles 
SET business_id = '6c5d19b9-e75c-48e6-a894-ca33882a0304'
WHERE business_id IS NULL;

-- Log that the migration was applied
INSERT INTO public.migration_logs (migration_name, applied_at, details)
VALUES (
  '20250724000000_fix_user_business_id_assignment',
  NOW(),
  'Updated handle_new_user function to assign Bond Chauffeur business_id and fixed existing profiles'
)
ON CONFLICT DO NOTHING;
