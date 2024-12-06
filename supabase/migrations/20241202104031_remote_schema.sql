create type "public"."team_invitation_status" as enum ('pending', 'awaiting_signup', 'accepted', 'rejected', 'expired');

drop policy "Enable insert for authenticated users only" on "public"."team_invitations";

drop policy "Facilitators can create invitations" on "public"."team_invitations";

drop policy "Team facilitators can manage invitations" on "public"."team_invitations";

drop policy "Team members can view invitations" on "public"."team_invitations";

drop policy "Users can view their own invitations" on "public"."team_invitations";

alter table "public"."team_invitations" drop constraint "team_invitations_status_check";

alter table "public"."team_invitations" alter column "status" set default 'pending'::team_invitation_status;

alter table "public"."team_invitations" alter column "status" set data type team_invitation_status using "status"::team_invitation_status;

alter table "public"."team_invitations" disable row level security;


