alter table "public"."team_invitations" alter column "status" drop default;

alter type "public"."team_invitation_status" rename to "team_invitation_status__old_version_to_be_dropped";

create type "public"."team_invitation_status" as enum ('pending', 'awaiting_signup', 'accepted', 'rejected', 'expired', 'cancelled');

alter table "public"."team_invitations" alter column status type "public"."team_invitation_status" using status::text::"public"."team_invitation_status";

alter table "public"."team_invitations" alter column "status" set default 'pending'::team_invitation_status;

drop type "public"."team_invitation_status__old_version_to_be_dropped";

alter table "public"."team_invitations" add constraint "team_invitations_status_check" CHECK ((status = ANY (ARRAY['pending'::team_invitation_status, 'awaiting_signup'::team_invitation_status, 'accepted'::team_invitation_status, 'expired'::team_invitation_status, 'cancelled'::team_invitation_status]))) not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_status_check";


