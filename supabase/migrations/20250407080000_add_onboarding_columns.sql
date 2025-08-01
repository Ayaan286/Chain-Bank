-- Add onboarding columns to profiles table
-- Migration: 20250407080000_add_onboarding_columns.sql

-- Add new columns for onboarding functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_number text,
ADD COLUMN IF NOT EXISTS public_key text,
ADD COLUMN IF NOT EXISTS wallet_address text,
ADD COLUMN IF NOT EXISTS private_key_hash text,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamp with time zone;

-- Create unique index on account_number to ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS profiles_account_number_idx ON public.profiles(account_number) WHERE account_number IS NOT NULL;

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS profiles_wallet_address_idx ON public.profiles(wallet_address) WHERE wallet_address IS NOT NULL;

-- Create index on public_key for faster lookups
CREATE INDEX IF NOT EXISTS profiles_public_key_idx ON public.profiles(public_key) WHERE public_key IS NOT NULL;

-- Add RLS policies for the new columns (if they don't exist)
-- Users can read their own profile data
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile data
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users can insert their own profile data
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Function to handle new user creation with onboarding data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, email_verified, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    COALESCE(NEW.created_at, NOW())
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.account_number IS 'Unique 12-digit account number for the user';
COMMENT ON COLUMN public.profiles.public_key IS 'Ethereum-compatible public key for cryptographic operations';
COMMENT ON COLUMN public.profiles.wallet_address IS 'Ethereum wallet address derived from the public key';
COMMENT ON COLUMN public.profiles.private_key_hash IS 'Hashed private key for secure storage (one-way hash)';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Flag indicating if user has completed the onboarding process';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'Timestamp when onboarding was completed'; 