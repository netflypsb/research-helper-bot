CREATE OR REPLACE FUNCTION public.increment_api_key_usage(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE api_key_usage 
  SET 
    uses_count = uses_count + 1,
    updated_at = NOW()
  WHERE user_id = user_id_param;
END;
$$;