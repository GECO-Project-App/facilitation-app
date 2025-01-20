revoke delete on table "public"."tutorial_to_me" from "anon";

revoke insert on table "public"."tutorial_to_me" from "anon";

revoke references on table "public"."tutorial_to_me" from "anon";

revoke select on table "public"."tutorial_to_me" from "anon";

revoke trigger on table "public"."tutorial_to_me" from "anon";

revoke truncate on table "public"."tutorial_to_me" from "anon";

revoke update on table "public"."tutorial_to_me" from "anon";

revoke delete on table "public"."tutorial_to_me" from "authenticated";

revoke insert on table "public"."tutorial_to_me" from "authenticated";

revoke references on table "public"."tutorial_to_me" from "authenticated";

revoke select on table "public"."tutorial_to_me" from "authenticated";

revoke trigger on table "public"."tutorial_to_me" from "authenticated";

revoke truncate on table "public"."tutorial_to_me" from "authenticated";

revoke update on table "public"."tutorial_to_me" from "authenticated";

revoke delete on table "public"."tutorial_to_me" from "service_role";

revoke insert on table "public"."tutorial_to_me" from "service_role";

revoke references on table "public"."tutorial_to_me" from "service_role";

revoke select on table "public"."tutorial_to_me" from "service_role";

revoke trigger on table "public"."tutorial_to_me" from "service_role";

revoke truncate on table "public"."tutorial_to_me" from "service_role";

revoke update on table "public"."tutorial_to_me" from "service_role";

alter table "public"."tutorial_to_me" drop constraint "tutorial_to_me_replied_id_fkey";

alter table "public"."tutorial_to_me" drop constraint "tutorial_to_me_team_id_fkey";

alter table "public"."tutorial_to_me" drop constraint "tutorial_to_me_pkey";

drop index if exists "public"."tutorial_to_me_pkey";

drop table "public"."tutorial_to_me";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion(p_exercise_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    all_submitted boolean;
    all_reviewed boolean;
    current_status exercise_status;
BEGIN
    -- Get current exercise status
    SELECT status INTO current_status
    FROM tutorial_to_me
    WHERE exercise_id = p_exercise_id;

    -- Check completion based on current status
    CASE current_status
        WHEN 'writing' THEN
            -- Check if all team members have submitted
            SELECT COUNT(*) = (
                SELECT COUNT(*)
                FROM team_members tm
                JOIN exercises e ON e.team_id = tm.team_id
                WHERE e.id = p_exercise_id
            )
            INTO all_submitted
            FROM exercise_data
            WHERE exercise_id = p_exercise_id;

            -- If all submitted, update to reviewing
            IF all_submitted THEN
                UPDATE tutorial_to_me
                SET status = 'reviewing'::exercise_status
                WHERE exercise_id = p_exercise_id;
                RETURN true;
            END IF;

        WHEN 'reviewing' THEN
            -- Check if all exercise data entries are reviewed
            SELECT bool_and(is_reviewed)
            INTO all_reviewed
            FROM exercise_data
            WHERE exercise_id = p_exercise_id;

            -- If all reviewed, update to completed
            IF all_reviewed THEN
                UPDATE tutorial_to_me
                SET 
                    status = 'completed'::exercise_status,
                    reviewed = true
                WHERE exercise_id = p_exercise_id;
                RETURN true;
            END IF;

        ELSE 
            RETURN false;
    END CASE;

    RETURN false;
END;
$function$
;


