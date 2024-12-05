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

export async function acceptInvitationAfterSignup(invitationId: string, userId: string) {
  const supabase = createClient();

  try {
    const {data: teamId, error} = await supabase.rpc('join_team_by_invitation', {
      invitation_id: invitationId,
      user_id: userId,
    });

    if (error) throw error;
    if (!teamId) return {error: 'Invalid invitation'};

    // Sync profile data
    const {data: synced, error: syncError} = await supabase.rpc('sync_team_member_profile', {
      p_team_id: teamId,
      p_user_id: userId,
    });

    if (syncError) {
      console.error('Profile sync error:', syncError);
    }

    revalidatePath('/team', 'page');
    return {success: true, teamId};
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {error: 'Failed to accept invitation'};
  }
}
