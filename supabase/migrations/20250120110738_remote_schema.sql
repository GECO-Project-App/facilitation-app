set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_ttm_exercise_data(p_user_id uuid)
 RETURNS TABLE(exercise_id uuid, author_id uuid, data jsonb, is_reviewed boolean, created_at timestamp with time zone, exercise_status text, exercise_deadline timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return query
  select 
    ed.exercise_id,
    ed.author_id,
    ed.data,
    ed.is_reviewed,
    ed.created_at,
    e.status as exercise_status,
    e.deadline as exercise_deadline
  from exercises e
  inner join exercise_data ed on e.id = ed.exercise_id
  where e.slug = 'ttm'
  and ed.author_id = p_user_id
  order by ed.created_at desc
  limit 1;
end;
$function$
;


