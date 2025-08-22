-- Update profiles table to include phone as the authentication field
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text UNIQUE;

-- Update the handle_new_user function to extract phone from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  ref_code TEXT;
BEGIN
  -- Generate referral code from phone (if available) or user ID
  ref_code := UPPER(SUBSTRING(COALESCE(NEW.phone, NEW.id::TEXT), 1, 8)) || SUBSTRING(NEW.id::TEXT, 1, 4);
  
  -- Insert profile for new user
  INSERT INTO public.profiles (user_id, full_name, phone, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.phone,
    ref_code
  );
  
  RETURN NEW;
END;
$function$