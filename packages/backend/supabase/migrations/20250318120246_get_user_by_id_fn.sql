CREATE OR REPLACE FUNCTION get_user_details_by_id(user_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    raw_user_meta_data JSONB
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT au.id, au.email, au.raw_user_meta_data
  FROM auth.users au 
  WHERE au.id = user_id;
END;
$$ LANGUAGE plpgsql;
