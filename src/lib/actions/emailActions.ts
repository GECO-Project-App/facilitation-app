import {getLocale} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {createClient} from '../supabase/server';

const inviteSchema = z.object({
  teamId: z.string().uuid(),
  email: z.string().email(),
  language: z.string().optional(),
});

export async function inviteTeamMember(data: z.infer<typeof inviteSchema>) {
  const supabase = createClient();
  const locale = await getLocale();

  try {
    const validatedFields = inviteSchema.parse(data);

    const {data: response, error} = await supabase.functions.invoke('invite-team-member', {
      body: {
        teamId: validatedFields.teamId,
        email: validatedFields.email,
        language: locale, // Pass the user's current locale
      },
    });

    if (error) throw error;
    return {success: true};
  } catch (error) {
    console.error('Team invitation error:', error);
    return {error: 'Failed to send invitation'};
  }
}

export async function acceptInvitationAfterSignup(invitationId: string, userId: string) {
  const supabase = createClient();

  try {
    const {data: invitation, error: inviteError} = await supabase
      .from('team_invitations')
      .select('*, teams(name)')
      .eq('id', invitationId)
      .eq('status', 'awaiting_signup')
      .single();

    if (inviteError || !invitation) {
      return {error: 'Invalid invitation'};
    }

    // Add user to team
    const {error: memberError} = await supabase.from('team_members').insert({
      team_id: invitation.team_id,
      user_id: userId,
      role: 'member',
    });

    if (memberError) throw memberError;

    // Update invitation status
    await supabase.from('team_invitations').update({status: 'accepted'}).eq('id', invitationId);

    revalidatePath('/team', 'page');
    return {success: true};
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {error: 'Failed to accept invitation'};
  }
}
