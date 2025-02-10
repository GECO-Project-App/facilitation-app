drop index if exists "public"."idx_team_members_view_team_id";

CREATE UNIQUE INDEX team_members_view_unique_idx ON public.team_members_view USING btree (team_id);


