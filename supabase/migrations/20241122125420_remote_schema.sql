set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    default_username TEXT;
BEGIN
    -- Generate a default username from email if not provided
    default_username := COALESCE(
        new.raw_user_meta_data->>'username',
        SPLIT_PART(new.email, '@', 1)
    );

    insert into public.profiles (
        id,
        first_name,
        last_name,
        avatar_url,
        username,
        updated_at
    ) values (
        new.id,
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        COALESCE(new.raw_user_meta_data->>'last_name', ''),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        default_username,
        now()
    );
    return new;
end;
$function$
;


