'use server';
import {getLocale} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {inviteTeamMemberSchema, InviteTeamMemberSchema} from '../zodSchemas';

export async function inviteTeamMember(data: InviteTeamMemberSchema) {
  const supabase = createClient();
  const locale = await getLocale();

  try {
    const validatedFields = inviteTeamMemberSchema.parse(data);
    const {data: authUser} = await supabase.auth.getUser();

    if (!authUser.user) {
      return {error: 'User not found'};
    }

    const {data: response, error} = await supabase.functions.invoke('invite-team-member', {
      body: {
        teamId: validatedFields.teamId,
        email: validatedFields.email,
        language: locale,
        authUserId: authUser.user.id,
      },
    });

    if (error) {
      return {error: error.message};
    }
    return {success: true, response};
  } catch (error) {
    console.error('Team invitation error:', error);
    return {error: 'Failed to send invitation'};
  }
}

export async function acceptTeamInvitation(invitationId: string) {
  const supabase = createClient();

  try {
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // Try to join the team
    const {data: teamId, error: joinError} = await supabase.rpc('join_team_by_invitation', {
      invitation_id: invitationId,
      p_user_id: user.id,
    });

    if (joinError) {
      console.error('Join error:', joinError);
      return {error: joinError.message};
    }

    if (!teamId) {
      return {error: 'Failed to join team'};
    }

    revalidatePath('/team', 'page');
    return {success: true, teamId};
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {error: 'Failed to accept invitation'};
  }
}
