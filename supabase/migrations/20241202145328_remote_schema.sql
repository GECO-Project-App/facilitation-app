set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_user_exists(email_input text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_input
  );
END;
$function$
;


