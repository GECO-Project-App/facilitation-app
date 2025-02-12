

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "auth";


ALTER SCHEMA "auth" OWNER TO "supabase_admin";


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "storage";


ALTER SCHEMA "storage" OWNER TO "supabase_admin";


CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE "auth"."aal_level" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


ALTER TYPE "auth"."code_challenge_method" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE "auth"."factor_status" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE "auth"."factor_type" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE "auth"."one_time_token_type" OWNER TO "supabase_auth_admin";


CREATE TYPE "public"."exercise_review_type" AS ENUM (
    'read_only',
    'vote'
);


ALTER TYPE "public"."exercise_review_type" OWNER TO "postgres";


CREATE TYPE "public"."exercise_status" AS ENUM (
    'writing',
    'reviewing',
    'completed'
);


ALTER TYPE "public"."exercise_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'team_invitation',
    'exercise_status_change',
    'new_exercise',
    'upcoming_deadline'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."profile_response" AS (
	"id" "uuid",
	"username" "text",
	"first_name" "text",
	"last_name" "text",
	"avatar_url" "text",
	"updated_at" timestamp with time zone
);


ALTER TYPE "public"."profile_response" OWNER TO "postgres";


CREATE TYPE "public"."team_invitation_status" AS ENUM (
    'pending',
    'awaiting_signup',
    'accepted',
    'rejected',
    'expired'
);


ALTER TYPE "public"."team_invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."team_role" AS ENUM (
    'member',
    'facilitator'
);


ALTER TYPE "public"."team_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION "auth"."email"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';



CREATE OR REPLACE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION "auth"."jwt"() OWNER TO "supabase_auth_admin";


CREATE OR REPLACE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION "auth"."role"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';



CREATE OR REPLACE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';



CREATE OR REPLACE FUNCTION "public"."check_exercise_completion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    team_member_count INT;
    submission_count INT;
BEGIN
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members tm
    JOIN exercises e ON e.team_id = tm.team_id
    WHERE e.id = NEW.exercise_id;
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    IF submission_count >= team_member_count THEN
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_exercise_completion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_exercise_deadlines"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    next_hour timestamptz := date_trunc('hour', NOW()) + interval '1 hour';
    r RECORD;  -- Add this declaration for the loop variable
BEGIN
    -- Log start of execution
    RAISE LOG 'Starting exercise deadline check at %', NOW();

    -- Schedule precise deadline checks for writing -> reviewing
    FOR r IN (
        SELECT id, (deadline->>'writing')::timestamptz as deadline_time
        FROM exercises
        WHERE status = 'writing'
        AND (deadline->>'writing')::timestamptz < next_hour
        AND (deadline->>'writing')::timestamptz > NOW()
    ) LOOP
        PERFORM public.schedule_deadline_check(r.id, r.deadline_time, 'reviewing');
    END LOOP;

    -- Schedule precise deadline checks for reviewing -> completed
    FOR r IN (
        SELECT id, (deadline->>'reviewing')::timestamptz as deadline_time
        FROM exercises
        WHERE status = 'reviewing'
        AND (deadline->>'reviewing')::timestamptz < next_hour
        AND (deadline->>'reviewing')::timestamptz > NOW()
    ) LOOP
        PERFORM public.schedule_deadline_check(r.id, r.deadline_time, 'completed');
    END LOOP;

    -- Handle any overdue deadlines immediately
    UPDATE exercises
    SET status = 'reviewing'
    WHERE status = 'writing'
    AND (deadline->>'writing')::timestamptz <= NOW();

    UPDATE exercises
    SET status = 'completed'
    WHERE status = 'reviewing'
    AND (deadline->>'reviewing')::timestamptz <= NOW();

    RAISE LOG 'Completed exercise deadline check at %', NOW();
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_deadlines: %', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."check_exercise_deadlines"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_exercise_reviews_completion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    all_reviewed boolean;
BEGIN
    -- Check if all exercise_data entries for this exercise are reviewed
    SELECT bool_and(is_reviewed)
    INTO all_reviewed
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;

    -- If all are reviewed, update exercise status to completed
    IF all_reviewed THEN
        UPDATE exercises
        SET status = 'completed'
        WHERE id = NEW.exercise_id
        AND status = 'reviewing';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_exercise_reviews_completion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = $1
        AND team_members.user_id = $2
    );
END;
$_$;


ALTER FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_upcoming_deadlines"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    exercise record;
begin
    -- Check for deadlines 24 hours away
    for exercise in (
        select id
        from exercises
        where 
            (deadline->>'writing')::timestamptz between now() and now() + interval '24 hours'
            or (deadline->>'reviewing')::timestamptz between now() and now() + interval '24 hours'
    )
    loop
        -- Create notifications for writing deadline
        if (exercise.deadline->>'writing')::timestamptz between now() and now() + interval '24 hours' then
            perform create_deadline_notification(exercise.id, 'writing');
        end if;
        
        -- Create notifications for reviewing deadline
        if (exercise.deadline->>'reviewing')::timestamptz between now() and now() + interval '24 hours' then
            perform create_deadline_notification(exercise.id, 'reviewing');
        end if;
    end loop;
end;
$$;


ALTER FUNCTION "public"."check_upcoming_deadlines"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_exists"("email_input" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_input
  );
END;
$$;


ALTER FUNCTION "public"."check_user_exists"("email_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_deadline_notification"("p_exercise_id" "uuid", "p_deadline_type" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details
    select e.*, t.name as team_name
    into v_exercise
    from exercises e
    join teams t on t.id = e.team_id
    where e.id = p_exercise_id;

    -- Create notification for each team member
    for v_team_members in (
        select tm.user_id
        from team_members tm
        where tm.team_id = v_exercise.team_id
    )
    loop
        insert into notifications (user_id, type, data)
        values (
            v_team_members.user_id,
            'upcoming_deadline',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'deadline_type', p_deadline_type,
                'deadline_time', v_exercise.deadline->>p_deadline_type
            )
        );
    end loop;
end;
$$;


ALTER FUNCTION "public"."create_deadline_notification"("p_exercise_id" "uuid", "p_deadline_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_exercise_status_notification"("p_exercise_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details
    select e.*, t.name as team_name
    into v_exercise
    from exercises e
    join teams t on t.id = e.team_id
    where e.id = p_exercise_id;

    -- Create notification for each team member
    for v_team_members in (
        select tm.user_id
        from team_members tm
        where tm.team_id = v_exercise.team_id
    )
    loop
        insert into notifications (user_id, type, data)
        values (
            v_team_members.user_id,
            'exercise_status_change',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'new_status', v_exercise.status
            )
        );
    end loop;
end;
$$;


ALTER FUNCTION "public"."create_exercise_status_notification"("p_exercise_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_new_exercise_notification"("p_exercise_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details including slug
    select e.*, t.name as team_name
    into v_exercise
    from exercises e
    join teams t on t.id = e.team_id
    where e.id = p_exercise_id;

    -- Create notification for each team member except creator
    for v_team_members in (
        select tm.user_id
        from team_members tm
        where tm.team_id = v_exercise.team_id
        and tm.user_id != v_exercise.created_by
    )
    loop
        insert into notifications (user_id, type, data)
        values (
            v_team_members.user_id,
            'new_exercise',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'slug', v_exercise.slug  -- Added slug to the notification data
            )
        );
    end loop;
end;
$$;


ALTER FUNCTION "public"."create_new_exercise_notification"("p_exercise_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    insert into notifications (user_id, type, data)
    values (
        p_user_id,
        'team_invitation',
        jsonb_build_object(
            'team_id', p_team_id,
            'team_name', p_team_name,
            'inviter_name', p_inviter_name
        )
    );
end;
$$;


ALTER FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text", "p_invitation_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    insert into notifications (user_id, type, data)
    values (
        p_user_id,
        'team_invitation',
        jsonb_build_object(
            'team_id', p_team_id,
            'team_name', p_team_name,
            'inviter_name', p_inviter_name,
            'invitation_id', p_invitation_id
        )
    );
end;
$$;


ALTER FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text", "p_invitation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select coalesce(
    (select email from auth.users where id = auth.uid()),
    (select email from team_invitations where id = current_setting('app.invitation_id', true)::uuid)
  );
$$;


ALTER FUNCTION "public"."current_user_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_team_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 6-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 6));
        
        -- Check if code already exists
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN code;
END;
$$;


ALTER FUNCTION "public"."generate_team_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_active_exercises"() RETURNS TABLE("id" "uuid", "team_id" "uuid", "created_by" "uuid", "created_at" timestamp with time zone, "status" "public"."exercise_status", "review_type" "public"."exercise_review_type", "deadline" "jsonb", "slug" "text", "team_name" "text", "creator_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.team_id,
        e.created_by,
        e.created_at,
        e.status,
        e.review_type,
        e.deadline,
        e.slug,
        t.name as team_name,
        CONCAT(p.first_name, ' ', p.last_name) as creator_name
    FROM exercises e
    JOIN teams t ON e.team_id = t.id
    JOIN profiles p ON e.created_by = p.id
    -- Join with team_members to check if current user is part of the team
    JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
    WHERE (e.deadline->>'reviewing')::timestamptz > NOW()
    ORDER BY (e.deadline->>'reviewing')::timestamptz ASC;
END;
$$;


ALTER FUNCTION "public"."get_active_exercises"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_profile"() RETURNS "public"."profile_response"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_profile public.profile_response;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    updated_at
  into v_profile
  from profiles
  where id = auth.uid();

  return v_profile;
end;
$$;


ALTER FUNCTION "public"."get_my_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status") RETURNS TABLE("user_id" "uuid", "first_name" "text", "last_name" "text", "profile_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            tm.profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    WHERE 
        CASE 
            WHEN p_status = 'writing' AND EXISTS (
                SELECT 1 FROM exercises e 
                WHERE e.id = p_exercise_id 
                AND e.status = 'writing'
            ) THEN
                -- Return users who haven't submitted their exercise data
                NOT EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                )
            WHEN p_status = 'reviewing' AND EXISTS (
                SELECT 1 FROM exercises e 
                WHERE e.id = p_exercise_id 
                AND e.status = 'reviewing'
            ) THEN
                -- Return users who have their own unreviewed submissions
                EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id  -- Added correlation to specific user
                    AND ed.is_reviewed = false
                )
            ELSE
                false
        END;
END;
$$;


ALTER FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status", "p_current_user" "uuid") RETURNS TABLE("user_id" "uuid", "first_name" "text", "last_name" "text", "profile_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            tm.profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    WHERE 
        CASE 
            WHEN p_status = 'writing' THEN
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM exercise_data ed 
                        WHERE ed.exercise_id = p_exercise_id 
                        AND ed.author_id = p_current_user
                    ) THEN
                        NOT EXISTS (
                            SELECT 1 FROM exercise_data ed 
                            WHERE ed.exercise_id = p_exercise_id 
                            AND ed.author_id = tu.user_id
                        )
                    ELSE
                        false
                END
            WHEN p_status = 'reviewing' THEN
                EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                    AND ed.is_reviewed = false
                )
            ELSE
                false
        END;
END;
$$;


ALTER FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status", "p_current_user" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_team_exercise_data"("p_exercise_id" "uuid") RETURNS TABLE("id" "uuid", "exercise_id" "uuid", "author_id" "uuid", "data" "jsonb", "created_at" timestamp with time zone, "is_reviewed" boolean, "author_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ed.id,
        ed.exercise_id,
        ed.author_id,
        ed.data,
        ed.created_at,
        ed.is_reviewed,
        tm.profile_name as author_name
    FROM exercise_data ed
    JOIN team_members tm ON tm.user_id = ed.author_id
    JOIN exercises e ON e.id = ed.exercise_id
    WHERE ed.exercise_id = p_exercise_id
    AND tm.team_id = e.team_id;
END;
$$;


ALTER FUNCTION "public"."get_team_exercise_data"("p_exercise_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_ttm_exercise_data"("p_user_id" "uuid") RETURNS TABLE("exercise_id" "uuid", "author_id" "uuid", "data" "jsonb", "is_reviewed" boolean, "created_at" timestamp with time zone, "exercise_status" "public"."exercise_status", "exercise_deadline" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return query
  select 
    ed.exercise_id,
    ed.author_id,
    ed.data,
    ed.is_reviewed,
    ed.created_at,
    e.status as exercise_status,
    e.deadline::jsonb as exercise_deadline  -- Cast deadline to jsonb
  from exercises e
  inner join exercise_data ed on e.id = ed.exercise_id
  where e.slug = 'ttm'
  and ed.author_id = p_user_id
  order by ed.created_at desc
  limit 1;
end;
$$;


ALTER FUNCTION "public"."get_ttm_exercise_data"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_email"("user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    RETURN (
        SELECT email 
        FROM auth.users 
        WHERE id = user_id
    );
END;
$$;


ALTER FUNCTION "public"."get_user_email"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_team_exercises"() RETURNS TABLE("id" "uuid", "team_id" "uuid", "created_by" "uuid", "created_at" timestamp with time zone, "status" "public"."exercise_status", "review_type" "public"."exercise_review_type", "deadline" "jsonb", "slug" "text", "team_name" "text", "team_members" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.team_id,
        e.created_by,
        e.created_at,
        e.status,
        e.review_type,
        e.deadline,
        e.slug,
        t.name as team_name,
        tmv.team_members
    FROM exercises e
    INNER JOIN teams t ON e.team_id = t.id
    INNER JOIN team_members_view tmv ON e.team_id = tmv.team_id
    WHERE EXISTS (
        SELECT 1 
        FROM team_members tm 
        WHERE tm.team_id = e.team_id 
        AND tm.user_id = auth.uid()
    )
    AND (e.deadline->>'reviewing')::timestamptz > NOW() -- Only return exercises where reviewing deadline hasn't passed
    ORDER BY e.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_team_exercises"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_exercise_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    perform create_exercise_status_notification(NEW.id);
    return NEW;
end;
$$;


ALTER FUNCTION "public"."handle_exercise_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_exercise"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    perform create_new_exercise_notification(NEW.id);
    return NEW;
end;
$$;


ALTER FUNCTION "public"."handle_new_exercise"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_team"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_team_code TEXT;
    user_profile RECORD;
    code_exists BOOLEAN;
BEGIN
    -- Generate unique team code loop
    LOOP
        new_team_code := upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 6));
        
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = new_team_code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    UPDATE teams 
    SET team_code = new_team_code 
    WHERE id = NEW.id;

    SELECT first_name, last_name, avatar_url 
    INTO user_profile 
    FROM profiles 
    WHERE id = NEW.created_by;

    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    ) VALUES (
        NEW.id,
        NEW.created_by,
        'facilitator',
        user_profile.first_name,
        user_profile.last_name,
        user_profile.avatar_url,
        CONCAT(user_profile.first_name, ' ', user_profile.last_name)
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_team"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_team_invitation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    v_team_name text;
    v_inviter_name text;
    v_user_id uuid;
begin
    -- Get user id from email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email;

    -- Get team name and inviter name
    SELECT t.name, concat(p.first_name, ' ', p.last_name)
    INTO v_team_name, v_inviter_name
    FROM teams t
    JOIN profiles p on p.id = NEW.invited_by
    WHERE t.id = NEW.team_id;

    -- Only create notification if user exists
    IF v_user_id IS NOT NULL THEN
        -- Create notification with invitation_id
        perform create_team_invitation_notification(
            v_user_id,
            NEW.team_id,
            v_team_name,
            v_inviter_name,
            NEW.id  -- Pass the invitation_id from the newly created invitation
        );
    END IF;
    
    return NEW;
end;
$$;


ALTER FUNCTION "public"."handle_team_invitation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_exercise_vote"("p_exercise_data_id" "uuid", "p_json_path" "text"[]) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  current_value INTEGER;
  updated_data JSONB;
BEGIN
  -- Get the current vote count
  SELECT (data #>> p_json_path)::INTEGER
  INTO current_value
  FROM exercise_data
  WHERE id = p_exercise_data_id;

  -- Increment the vote count
  UPDATE exercise_data
  SET data = jsonb_set(
    data::jsonb,
    p_json_path,
    ((COALESCE(current_value, 0) + 1)::TEXT)::jsonb
  )
  WHERE id = p_exercise_data_id
  RETURNING data INTO updated_data;

  RETURN updated_data;
END;
$$;


ALTER FUNCTION "public"."increment_exercise_vote"("p_exercise_data_id" "uuid", "p_json_path" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_username_available"("p_username" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return not exists (
    select 1 from profiles
    where username = p_username
    and id != auth.uid()
  );
end;
$$;


ALTER FUNCTION "public"."is_username_available"("p_username" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_team_by_code"("team_code_input" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    team_id_var uuid;
    v_profile record;
BEGIN
    -- Log the input and current user
    RAISE LOG 'Attempting to join team with code: %, user: %', team_code_input, auth.uid();

    -- Get team ID from code
    SELECT id INTO team_id_var
    FROM teams
    WHERE team_code = team_code_input;

    IF team_id_var IS NULL THEN
        RAISE EXCEPTION 'Invalid team code: %', team_code_input;
    END IF;

    RAISE LOG 'Found team ID: %', team_id_var;

    -- Get user profile
    SELECT *
    INTO v_profile
    FROM profiles
    WHERE id = auth.uid();

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found for user: %', auth.uid();
    END IF;

    RAISE LOG 'Found profile for user: % % %', v_profile.first_name, v_profile.last_name, v_profile.id;

    -- Check if already a member
    IF EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_id = team_id_var AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'User is already a member of this team';
    END IF;

    -- Insert team member with profile data
    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    )
    VALUES (
        team_id_var,
        auth.uid(),
        'member',
        COALESCE(v_profile.first_name, ''),
        COALESCE(v_profile.last_name, ''),
        COALESCE(v_profile.avatar_url, ''),
        COALESCE(NULLIF(CONCAT(v_profile.first_name, ' ', v_profile.last_name), ' '), 'Anonymous User')
    );

    RAISE LOG 'Successfully inserted team member';

    RETURN team_id_var;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in join_team_by_code: %', SQLERRM;
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."join_team_by_code"("team_code_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_team_by_invitation"("invitation_id" "uuid", "p_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_team_id uuid;
    v_invitation record;
    v_profile record;
BEGIN
    -- Get invitation details
    SELECT *
    INTO v_invitation
    FROM team_invitations ti
    WHERE ti.id = invitation_id 
    AND ti.status IN ('awaiting_signup', 'pending');

    IF v_invitation IS NULL THEN
        RAISE EXCEPTION 'Invalid invitation';
    END IF;

    -- Get profile
    SELECT *
    INTO v_profile
    FROM profiles p
    WHERE p.id = p_user_id;

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM team_members tm
        WHERE tm.team_id = v_invitation.team_id 
        AND tm.user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User is already a team member';
    END IF;

    -- Insert team member
    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    )
    VALUES (
        v_invitation.team_id,
        p_user_id,
        'member',
        v_profile.first_name,
        v_profile.last_name,
        v_profile.avatar_url,
        CONCAT(v_profile.first_name, ' ', v_profile.last_name)
    );

    -- Update invitation status
    UPDATE team_invitations
    SET status = 'accepted'
    WHERE id = invitation_id;

    RETURN v_invitation.team_id;
END;
$$;


ALTER FUNCTION "public"."join_team_by_invitation"("invitation_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    update notifications
    set is_read = true
    where id = p_notification_id
    and user_id = auth.uid();
    
    return found;
end;
$$;


ALTER FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_exercise_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Only notify when status changes to 'reviewing'
    IF NEW.status = 'reviewing' AND OLD.status = 'writing' THEN
        PERFORM
            net.http_post(
                url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
                headers := jsonb_build_object(
                    'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                    'Content-Type', 'application/json'
                ),
                body := jsonb_build_object('exerciseId', NEW.id)
            );
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't prevent the status change
    RAISE LOG 'Error in notify_exercise_status_change: %', SQLERRM;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_exercise_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_team_members_view"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_members_view;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."refresh_team_members_view"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_team_permissions"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."refresh_team_permissions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."schedule_deadline_check"("exercise_id" "uuid", "deadline_time" timestamp with time zone, "new_status" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    job_name text;
    schedule_time text;
BEGIN
    -- Create unique job name
    job_name := 'deadline_' || exercise_id::text;
    
    -- Extract minute and hour for cron schedule
    schedule_time := format('%s %s * * *', 
        extract(minute from deadline_time)::text,
        extract(hour from deadline_time)::text
    );

    -- Remove existing job if it exists
    PERFORM extensions.cron.unschedule(job_name);

    -- Schedule the one-time update with proper quoting
    PERFORM extensions.cron.schedule(
        job_name,
        schedule_time,
        format(
            'UPDATE exercises SET status = %L WHERE id = %L AND status != %L; SELECT extensions.cron.unschedule(%L);',
            new_status,
            exercise_id,
            new_status,
            job_name
        )
    );
END;
$$;


ALTER FUNCTION "public"."schedule_deadline_check"("exercise_id" "uuid", "deadline_time" timestamp with time zone, "new_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Update all relevant fields in team_members when profile is updated
    UPDATE team_members
    SET 
        first_name = NEW.first_name,
        last_name = NEW.last_name,
        avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_profile_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_team_member_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Only proceed if avatar_url has changed
    IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url THEN
        UPDATE team_members
        SET avatar_url = NEW.avatar_url
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_team_member_avatar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_team_member_profile"("p_team_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    profile_exists boolean;
BEGIN
    -- Check if profile exists and has required data
    SELECT EXISTS (
        SELECT 1 
        FROM profiles p 
        WHERE p.id = p_user_id 
        AND p.first_name IS NOT NULL 
        AND p.last_name IS NOT NULL
    ) INTO profile_exists;

    IF NOT profile_exists THEN
        RETURN false;
    END IF;

    -- Update team member with latest profile info
    UPDATE team_members tm
    SET 
        first_name = p.first_name,
        last_name = p.last_name,
        avatar_url = p.avatar_url,
        profile_name = CONCAT(p.first_name, ' ', p.last_name)
    FROM profiles p
    WHERE p.id = p_user_id
    AND tm.user_id = p_user_id
    AND tm.team_id = p_team_id;

    RETURN true;
END;
$$;


ALTER FUNCTION "public"."sync_team_member_profile"("p_team_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile"("p_username" "text" DEFAULT NULL::"text", "p_first_name" "text" DEFAULT NULL::"text", "p_last_name" "text" DEFAULT NULL::"text", "p_avatar_url" "text" DEFAULT NULL::"text") RETURNS "public"."profile_response"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_profile public.profile_response;
begin
  -- Check if user is authenticated
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Validate username if provided
  if p_username is not null then
    if length(p_username) < 3 then
      raise exception 'Username must be at least 3 characters long';
    end if;
    
    if not public.is_username_available(p_username) then
      raise exception 'Username is already taken';
    end if;
  end if;

  -- Update profile
  update profiles
  set
    username = coalesce(p_username, username),
    first_name = coalesce(p_first_name, first_name),
    last_name = coalesce(p_last_name, last_name),
    avatar_url = coalesce(p_avatar_url, avatar_url),
    updated_at = now()
  where id = auth.uid()
  returning
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    updated_at
  into v_profile;

  -- Update auth.users metadata
  update auth.users
  set raw_user_meta_data = jsonb_build_object(
    'username', v_profile.username,
    'first_name', v_profile.first_name,
    'last_name', v_profile.last_name,
    'avatar_url', v_profile.avatar_url
  )
  where id = auth.uid();

  return v_profile;
end;
$$;


ALTER FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text" DEFAULT NULL::"text", "p_description" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    updated_member json;
BEGIN
    UPDATE team_members
    SET 
        profile_name = COALESCE(p_profile_name, profile_name),
        description = COALESCE(p_description, description)
    WHERE team_id = p_team_id 
    AND user_id = auth.uid()
    RETURNING to_json(team_members.*) INTO updated_member;
    
    RETURN updated_member;
END;
$$;


ALTER FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE team_members
    SET profile_name = p_profile_name
    WHERE team_id = p_team_id 
    AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION "storage"."extension"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION "storage"."filename"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION "storage"."foldername"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION "storage"."get_size_by_bucket"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION "storage"."operation"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_storage_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" "json",
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE "auth"."audit_log_entries" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';



CREATE TABLE IF NOT EXISTS "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


ALTER TABLE "auth"."flow_state" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';



CREATE TABLE IF NOT EXISTS "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "auth"."identities" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';



COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';



CREATE TABLE IF NOT EXISTS "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "auth"."instances" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';



CREATE TABLE IF NOT EXISTS "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';



CREATE TABLE IF NOT EXISTS "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';



CREATE TABLE IF NOT EXISTS "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid"
);


ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';



CREATE TABLE IF NOT EXISTS "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_auth_admin";


CREATE TABLE IF NOT EXISTS "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';



CREATE SEQUENCE IF NOT EXISTS "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_auth_admin";


ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";



CREATE TABLE IF NOT EXISTS "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';



CREATE TABLE IF NOT EXISTS "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';



CREATE TABLE IF NOT EXISTS "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


ALTER TABLE "auth"."schema_migrations" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';



CREATE TABLE IF NOT EXISTS "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text"
);


ALTER TABLE "auth"."sessions" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';



COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';



CREATE TABLE IF NOT EXISTS "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';



CREATE TABLE IF NOT EXISTS "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';



COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';



CREATE TABLE IF NOT EXISTS "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


ALTER TABLE "auth"."users" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';



COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';



CREATE TABLE IF NOT EXISTS "public"."exercise_data" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "exercise_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "data" "jsonb" NOT NULL,
    "is_reviewed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "exercise_data_data_check" CHECK (("jsonb_typeof"("data") = 'object'::"text"))
);


ALTER TABLE "public"."exercise_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "public"."exercise_status" DEFAULT 'writing'::"public"."exercise_status",
    "review_type" "public"."exercise_review_type" DEFAULT 'read_only'::"public"."exercise_review_type",
    "deadline" "jsonb" NOT NULL,
    "slug" "text" NOT NULL,
    CONSTRAINT "deadline_schema" CHECK ((("jsonb_typeof"("deadline") = 'object'::"text") AND ("deadline" ? 'writing'::"text") AND ("deadline" ? 'reviewing'::"text") AND ("jsonb_typeof"(("deadline" -> 'writing'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("deadline" -> 'reviewing'::"text")) = 'string'::"text") AND (("deadline" ->> 'writing'::"text") IS NOT NULL) AND (("deadline" ->> 'reviewing'::"text") IS NOT NULL)))
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."notification_type" NOT NULL,
    "data" "jsonb" NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_data_check" CHECK (("jsonb_typeof"("data") = 'object'::"text"))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    CONSTRAINT "username_length" CHECK ((("username" IS NULL) OR ("char_length"("username") >= 3)))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "invited_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval),
    "status" "public"."team_invitation_status" DEFAULT 'pending'::"public"."team_invitation_status"
);


ALTER TABLE "public"."team_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "team_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."team_role" DEFAULT 'member'::"public"."team_role",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    "description" character varying(480),
    "profile_name" "text"
);


ALTER TABLE "public"."team_members" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."team_members_view" AS
 SELECT "team_members"."team_id",
    "jsonb_agg"("jsonb_build_object"('user_id', "team_members"."user_id", 'first_name', "team_members"."first_name", 'last_name', "team_members"."last_name", 'profile_name', "team_members"."profile_name", 'avatar_url', "team_members"."avatar_url", 'role', "team_members"."role")) AS "team_members"
   FROM "public"."team_members"
  GROUP BY "team_members"."team_id"
  WITH NO DATA;


ALTER TABLE "public"."team_members_view" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."team_permissions" AS
 SELECT DISTINCT "tm"."team_id",
    "tm"."user_id"
   FROM "public"."team_members" "tm"
  WITH NO DATA;


ALTER TABLE "public"."team_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "team_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text"
);


ALTER TABLE "storage"."buckets" OWNER TO "supabase_storage_admin";


COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';



CREATE TABLE IF NOT EXISTS "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "storage"."migrations" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."objects" OWNER TO "supabase_storage_admin";


COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';



CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."s3_multipart_uploads" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."s3_multipart_uploads_parts" OWNER TO "supabase_storage_admin";


ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");



ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");



ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");



ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_data"
    ADD CONSTRAINT "exercise_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_invitations"
    ADD CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id", "user_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_team_code_key" UNIQUE ("team_code");



ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");



ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");



CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");



CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");



CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");



CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);



CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");



COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';



CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");



CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");



CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");



CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");



CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");



CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");



CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");



CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");



CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");



CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");



CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");



CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");



CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);



CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");



CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);



CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");



CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");



CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);



CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");



CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));



CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");



CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));



CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");



CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");



CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);



COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';



CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));



CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");



CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");



CREATE INDEX "idx_exercises_slug" ON "public"."exercises" USING "btree" ("slug");



CREATE INDEX "idx_exercises_status" ON "public"."exercises" USING "btree" ("status");



CREATE INDEX "idx_exercises_team" ON "public"."exercises" USING "btree" ("team_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_team_members_user_team" ON "public"."team_members" USING "btree" ("user_id", "team_id");



CREATE INDEX "idx_teams_created_by" ON "public"."teams" USING "btree" ("created_by");



CREATE UNIQUE INDEX "team_members_view_unique_idx" ON "public"."team_members_view" USING "btree" ("team_id");



CREATE UNIQUE INDEX "team_permissions_idx" ON "public"."team_permissions" USING "btree" ("team_id", "user_id");



CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");



CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");



CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");



CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");



CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");



CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "check_exercise_reviews_completion_trigger" AFTER UPDATE OF "is_reviewed" ON "public"."exercise_data" FOR EACH ROW WHEN (("new"."is_reviewed" = true)) EXECUTE FUNCTION "public"."check_exercise_reviews_completion"();



CREATE OR REPLACE TRIGGER "notify_status_change" AFTER UPDATE OF "status" ON "public"."exercises" FOR EACH ROW EXECUTE FUNCTION "public"."notify_exercise_status_change"();



CREATE OR REPLACE TRIGGER "on_exercise_created" AFTER INSERT ON "public"."exercises" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_exercise"();



CREATE OR REPLACE TRIGGER "on_exercise_status_change" AFTER UPDATE OF "status" ON "public"."exercises" FOR EACH ROW WHEN (("old"."status" IS DISTINCT FROM "new"."status")) EXECUTE FUNCTION "public"."handle_exercise_status_change"();



CREATE OR REPLACE TRIGGER "on_team_created" AFTER INSERT ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_team"();



CREATE OR REPLACE TRIGGER "on_team_invitation" AFTER INSERT ON "public"."team_invitations" FOR EACH ROW EXECUTE FUNCTION "public"."handle_team_invitation"();



CREATE OR REPLACE TRIGGER "refresh_team_members_view_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."team_members" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_team_members_view"();



CREATE OR REPLACE TRIGGER "refresh_team_permissions_on_member_change" AFTER INSERT OR DELETE OR UPDATE ON "public"."team_members" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_team_permissions"();



CREATE OR REPLACE TRIGGER "sync_profile_changes" AFTER UPDATE OF "first_name", "last_name", "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_profile_changes"();



CREATE OR REPLACE TRIGGER "update_exercise_status" AFTER INSERT OR UPDATE ON "public"."exercise_data" FOR EACH ROW EXECUTE FUNCTION "public"."check_exercise_completion"();



CREATE OR REPLACE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_invitations"
    ADD CONSTRAINT "team_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_invitations"
    ADD CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;



ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable insert for authenticated users" ON "public"."team_members" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable trigger updates on exercises" ON "public"."exercises" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Insert members" ON "public"."team_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Only facilitators can create exercises" ON "public"."exercises" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."team_members"
  WHERE (("team_members"."team_id" = "exercises"."team_id") AND ("team_members"."user_id" = "auth"."uid"()) AND ("team_members"."role" = 'facilitator'::"public"."team_role")))));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Read invitations" ON "public"."team_invitations" FOR SELECT USING (true);



CREATE POLICY "System can create notifications" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Team members can create invitations" ON "public"."team_invitations" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."team_members"
  WHERE (("team_members"."team_id" = "team_invitations"."team_id") AND ("team_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Team members can view exercises" ON "public"."exercises" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."team_members"
  WHERE (("team_members"."team_id" = "exercises"."team_id") AND ("team_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Update invitations" ON "public"."team_invitations" FOR UPDATE USING (true);



CREATE POLICY "Update own invitations" ON "public"."team_invitations" FOR UPDATE TO "authenticated" USING (("email" = "auth"."email"()));



CREATE POLICY "Users can insert their own exercise data" ON "public"."exercise_data" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can mark their own notifications as read" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK ((("auth"."uid"() = "user_id") AND ("is_read" = true)));



CREATE POLICY "Users can read their own exercise data" ON "public"."exercise_data" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own exercise data" ON "public"."exercise_data" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "author_id")) WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."exercise_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "team_members_access_policy" ON "public"."team_members" TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."team_permissions" "tp"
  WHERE (("tp"."team_id" = "team_members"."team_id") AND ("tp"."user_id" = "auth"."uid"()))))));



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "teams_access_policy" ON "public"."teams" TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."team_permissions" "tp"
  WHERE (("tp"."team_id" = "teams"."id") AND ("tp"."user_id" = "auth"."uid"())))) OR ("team_code" IS NOT NULL)));



CREATE POLICY "Anyone can upload an avatar." ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'avatars'::"text"));



CREATE POLICY "Avatar images are publicly accessible." ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'avatars'::"text"));



ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "auth" TO "anon";
GRANT USAGE ON SCHEMA "auth" TO "authenticated";
GRANT USAGE ON SCHEMA "auth" TO "service_role";
GRANT ALL ON SCHEMA "auth" TO "supabase_auth_admin";
GRANT ALL ON SCHEMA "auth" TO "dashboard_user";
GRANT ALL ON SCHEMA "auth" TO "postgres";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON SCHEMA "storage" TO "postgres";
GRANT USAGE ON SCHEMA "storage" TO "anon";
GRANT USAGE ON SCHEMA "storage" TO "authenticated";
GRANT USAGE ON SCHEMA "storage" TO "service_role";
GRANT ALL ON SCHEMA "storage" TO "supabase_storage_admin";
GRANT ALL ON SCHEMA "storage" TO "dashboard_user";



GRANT ALL ON FUNCTION "auth"."email"() TO "dashboard_user";



GRANT ALL ON FUNCTION "auth"."jwt"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "dashboard_user";



GRANT ALL ON FUNCTION "auth"."role"() TO "dashboard_user";



GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";



GRANT ALL ON FUNCTION "public"."check_exercise_completion"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_exercise_completion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_exercise_completion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_exercise_deadlines"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_exercise_deadlines"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_exercise_deadlines"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_exercise_reviews_completion"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_exercise_reviews_completion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_exercise_reviews_completion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_upcoming_deadlines"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_upcoming_deadlines"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_upcoming_deadlines"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_exists"("email_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_exists"("email_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_exists"("email_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_deadline_notification"("p_exercise_id" "uuid", "p_deadline_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_deadline_notification"("p_exercise_id" "uuid", "p_deadline_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_deadline_notification"("p_exercise_id" "uuid", "p_deadline_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_exercise_status_notification"("p_exercise_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_exercise_status_notification"("p_exercise_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_exercise_status_notification"("p_exercise_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_new_exercise_notification"("p_exercise_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_exercise_notification"("p_exercise_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_exercise_notification"("p_exercise_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text", "p_invitation_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text", "p_invitation_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_team_invitation_notification"("p_user_id" "uuid", "p_team_id" "uuid", "p_team_name" "text", "p_inviter_name" "text", "p_invitation_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_active_exercises"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_active_exercises"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_active_exercises"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status") TO "anon";
GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status", "p_current_user" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status", "p_current_user" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_pending_users"("p_exercise_id" "uuid", "p_status" "public"."exercise_status", "p_current_user" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_team_exercise_data"("p_exercise_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_team_exercise_data"("p_exercise_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_team_exercise_data"("p_exercise_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_ttm_exercise_data"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_ttm_exercise_data"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_ttm_exercise_data"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_email"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_team_exercises"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_team_exercises"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_team_exercises"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_exercise_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_exercise_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_exercise_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_exercise"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_exercise"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_exercise"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_team_invitation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_team_invitation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_team_invitation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_exercise_vote"("p_exercise_data_id" "uuid", "p_json_path" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_exercise_vote"("p_exercise_data_id" "uuid", "p_json_path" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_exercise_vote"("p_exercise_data_id" "uuid", "p_json_path" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."join_team_by_invitation"("invitation_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."join_team_by_invitation"("invitation_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_team_by_invitation"("invitation_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_exercise_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_exercise_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_exercise_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_team_members_view"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_team_members_view"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_team_members_view"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."schedule_deadline_check"("exercise_id" "uuid", "deadline_time" timestamp with time zone, "new_status" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."schedule_deadline_check"("exercise_id" "uuid", "deadline_time" timestamp with time zone, "new_status" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."schedule_deadline_check"("exercise_id" "uuid", "deadline_time" timestamp with time zone, "new_status" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_team_member_profile"("p_team_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_team_member_profile"("p_team_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_team_member_profile"("p_team_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "service_role";



GRANT ALL ON TABLE "auth"."audit_log_entries" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."audit_log_entries" TO "postgres";
GRANT SELECT ON TABLE "auth"."audit_log_entries" TO "postgres" WITH GRANT OPTION;



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."flow_state" TO "postgres";
GRANT SELECT ON TABLE "auth"."flow_state" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."flow_state" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."identities" TO "postgres";
GRANT SELECT ON TABLE "auth"."identities" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."identities" TO "dashboard_user";



GRANT ALL ON TABLE "auth"."instances" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."instances" TO "postgres";
GRANT SELECT ON TABLE "auth"."instances" TO "postgres" WITH GRANT OPTION;



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_amr_claims" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_amr_claims" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_challenges" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_challenges" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_factors" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_factors" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_factors" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."one_time_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."one_time_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "dashboard_user";



GRANT ALL ON TABLE "auth"."refresh_tokens" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."refresh_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."refresh_tokens" TO "postgres" WITH GRANT OPTION;



GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "dashboard_user";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "postgres";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_providers" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_relay_states" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_relay_states" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "dashboard_user";



GRANT ALL ON TABLE "auth"."schema_migrations" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."schema_migrations" TO "postgres";
GRANT SELECT ON TABLE "auth"."schema_migrations" TO "postgres" WITH GRANT OPTION;



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sessions" TO "postgres";
GRANT SELECT ON TABLE "auth"."sessions" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sessions" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_domains" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_domains" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_domains" TO "dashboard_user";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_providers" TO "dashboard_user";



GRANT ALL ON TABLE "auth"."users" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."users" TO "postgres";
GRANT SELECT ON TABLE "auth"."users" TO "postgres" WITH GRANT OPTION;



GRANT ALL ON TABLE "public"."exercise_data" TO "anon";
GRANT ALL ON TABLE "public"."exercise_data" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_data" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."team_invitations" TO "anon";
GRANT ALL ON TABLE "public"."team_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."team_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";



GRANT ALL ON TABLE "public"."team_members_view" TO "anon";
GRANT ALL ON TABLE "public"."team_members_view" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members_view" TO "service_role";



GRANT ALL ON TABLE "public"."team_permissions" TO "anon";
GRANT ALL ON TABLE "public"."team_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."team_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



GRANT ALL ON TABLE "storage"."buckets" TO "anon";
GRANT ALL ON TABLE "storage"."buckets" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets" TO "postgres";



GRANT ALL ON TABLE "storage"."migrations" TO "anon";
GRANT ALL ON TABLE "storage"."migrations" TO "authenticated";
GRANT ALL ON TABLE "storage"."migrations" TO "service_role";
GRANT ALL ON TABLE "storage"."migrations" TO "postgres";



GRANT ALL ON TABLE "storage"."objects" TO "anon";
GRANT ALL ON TABLE "storage"."objects" TO "authenticated";
GRANT ALL ON TABLE "storage"."objects" TO "service_role";
GRANT ALL ON TABLE "storage"."objects" TO "postgres";



GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "anon";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "postgres";



GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "anon";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "postgres";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "service_role";



RESET ALL;
