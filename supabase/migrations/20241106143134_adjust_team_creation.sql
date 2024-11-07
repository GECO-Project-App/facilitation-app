-- Remove the trigger first
DROP TRIGGER IF EXISTS on_team_member_created ON public.teams;

-- Then remove the function
DROP FUNCTION IF EXISTS public.handle_team_member();