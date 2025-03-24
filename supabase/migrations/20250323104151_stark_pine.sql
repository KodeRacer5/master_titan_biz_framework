/*
  # Update Authentication Settings

  1. Security Updates
    - Set OTP token expiry to 30 minutes (recommended security practice)
    - Configure rate limiting for OTP attempts
    - Add additional security measures

  2. Changes
    - Modify auth.email_templates for OTP emails
    - Update auth settings for token expiry
    - Add rate limiting configuration
*/

BEGIN;

-- Update auth settings for OTP
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

-- Configure rate limiting
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

-- Create audit log for tracking attempts
CREATE TABLE IF NOT EXISTS auth.users_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add trigger for rate limiting
DROP TRIGGER IF EXISTS rate_limit_trigger ON auth.users_audit_log;
CREATE TRIGGER rate_limit_trigger
  BEFORE INSERT ON auth.users_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION auth.rate_limit();

COMMIT;