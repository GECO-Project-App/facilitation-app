'use server';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {createClient} from '../supabase/server';
import {CreateTeamSchema, createTeamSchema} from '../zodSchemas';

export async function createTeam(data: CreateTeamSchema) {
  const supabase = createClient();

  try {
    const validatedFields = createTeamSchema.parse(data);

    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const {data: teamData, error: teamError} = await supabase
      .from('teams')
      .insert({
        name: validatedFields.name,
        created_by: user.user.id,
      })
      .select()
      .single();

    if (teamError) {
      console.log(teamError);
      return {error: teamError.message};
    }

    revalidatePath('/team', 'page');
    return {success: true, teamId: teamData.id};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    console.log('Unexpected error:', error);
    return {error: 'Failed to create team'};
  }
}

export async function inviteTeamMember(teamId: string, email: string) {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('team_invitations')
    .insert({team_id: teamId, email})
    .select();
  return {data, error};
}

export async function acceptInvitation(invitationId: string) {
  const supabase = createClient();

  const {data, error} = await supabase.rpc('handle_invitation_acceptance', {
    invitation_id: invitationId,
  });
  return {data, error};
}

export async function joinTeamByCode(teamCode: string) {
  const supabase = createClient();

  try {
    // Get the current user
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // First, find the team with the given code
    const {data: teamData, error: teamError} = await supabase
      .from('teams')
      .select('id')
      .eq('team_code', teamCode)
      .single();

    if (teamError) {
      console.log('Team lookup error:', teamError);
      return {error: 'Invalid team code'};
    }

    if (!teamData) {
      return {error: 'Team not found'};
    }

    // Check if user is already a member
    const {data: existingMember, error: memberCheckError} = await supabase
      .from('team_members')
      .select()
      .eq('team_id', teamData.id)
      .eq('user_id', user.user.id)
      .single();

    if (existingMember) {
      return {error: 'You are already a member of this team'};
    }

    // Add user as a member
    const {error: insertError} = await supabase.from('team_members').insert({
      team_id: teamData.id,
      user_id: user.user.id,
      role: 'member',
    });

    if (insertError) {
      console.log('Join team error:', insertError);
      return {error: 'Failed to join team'};
    }

    revalidatePath('/team', 'page');
    return {success: true, teamId: teamData.id};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to join team'};
  }
}

export async function getUserTeams() {
  const supabase = createClient();

  try {
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // First get the user's team IDs
    const {data: userTeams, error: userTeamsError} = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.user.id);

    if (userTeamsError) throw userTeamsError;

    // Then get the full team details
    const teamIds = userTeams.map((t) => t.team_id);
    const {data: teams, error: teamsError} = await supabase
      .from('teams')
      .select(
        `
        id,
        name,
        team_code,
        created_at,
        created_by,
        team_members (
          role,
          user_id,
          avatar_url,
          first_name,
          last_name
        )
      `,
      )
      .in('id', teamIds);

    if (teamsError) {
      console.log('Error fetching teams:', teamsError);
      return {error: 'Failed to fetch teams'};
    }

    return {teams};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to fetch teams'};
  }
}
