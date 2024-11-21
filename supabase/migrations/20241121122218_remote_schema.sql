set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  default_username text;
  username_exists boolean;
  counter integer := 0;
begin
  -- Create default username from first_name and last_name
  default_username := lower(
    concat(
      regexp_replace(new.raw_user_meta_data->>'first_name', '[^a-zA-Z0-9]', '', 'g'),
      regexp_replace(new.raw_user_meta_data->>'last_name', '[^a-zA-Z0-9]', '', 'g')
    )
  );

  -- Check if username exists and append number if needed
  LOOP
    IF counter > 0 THEN
      default_username := concat(default_username, counter);
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE username = default_username
    ) INTO username_exists;

    EXIT WHEN NOT username_exists;
    counter := counter + 1;
  END LOOP;

  insert into public.profiles (
    id,
    first_name,
    last_name,
    avatar_url,
    username,
    updated_at
  ) values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    default_username,
    now()
  );
  return new;
end;
$function$
;


