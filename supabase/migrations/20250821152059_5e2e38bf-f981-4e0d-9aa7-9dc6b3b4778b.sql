-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
BEGIN
  -- Generate referral code from email
  ref_code := UPPER(SUBSTRING(REPLACE(NEW.email, '@', ''), 1, 8)) || SUBSTRING(NEW.id::TEXT, 1, 4);
  
  -- Insert profile for new user
  INSERT INTO public.profiles (user_id, full_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    ref_code
  );
  
  RETURN NEW;
END;
$$;