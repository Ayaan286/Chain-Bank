/*
  # Update profiles table for enhanced registration

  This migration updates the profiles table to include new fields required for the enhanced registration form:
  - full_name: User's full name
  - country: User's country
  - user_type: Individual or Business
  - date_of_birth: User's date of birth
  - email: User's email (for easier access)
  
  The existing fields (account_number, private_key_hash) are kept for backward compatibility
  but made optional since they're not part of the new registration flow.
*/

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('individual', 'business')),
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS email text;

-- Make existing fields optional for new registration flow
ALTER TABLE public.profiles 
ALTER COLUMN account_number DROP NOT NULL,
ALTER COLUMN private_key_hash DROP NOT NULL;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Add index on user_type for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Update RLS policies to include new fields
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add policy for inserting new profiles
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a function to automatically set email from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, email_verified)
  VALUES (new.id, new.email, new.email_confirmed_at IS NOT NULL);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 