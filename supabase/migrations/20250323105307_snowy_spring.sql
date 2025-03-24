/*
  # Authentication Schema Setup

  1. New Tables
    - `users` (public schema)
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `last_sign_in` (timestamp)

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users
    - Configure OTP settings
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_sign_in timestamptz
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Configure OTP settings
DO $$
BEGIN
  -- Update auth settings
  ALTER TABLE auth.users 
    ALTER COLUMN confirmation_token_expires 
    SET DEFAULT CURRENT_TIMESTAMP + interval '30 minutes';

  -- Update email templates
  UPDATE auth.email_templates
  SET template = '
    <h2>Login to Your Account</h2>
    <p>Your one-time password (OTP) is: {{ .Token }}</p>
    <p>This code will expire in 30 minutes.</p>
    <p>If you did not request this code, please ignore this email.</p>
  '
  WHERE template_type = 'otp';
END $$;

-- Create audit log for tracking attempts
CREATE TABLE IF NOT EXISTS auth.users_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION auth.rate_limit() 
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users_audit_log 
    WHERE user_id = NEW.user_id 
    AND created_at > NOW() - interval '5 minutes'
    GROUP BY user_id 
    HAVING COUNT(*) > 5
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting trigger
DROP TRIGGER IF EXISTS rate_limit_trigger ON auth.users_audit_log;
CREATE TRIGGER rate_limit_trigger
  BEFORE INSERT ON auth.users_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION auth.rate_limit();