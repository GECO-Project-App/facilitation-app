'use server';
import {getLocale} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {Enums} from '../../../database.types';
import {createClient} from '../supabase/server';
import {
  CreateTeamSchema,
  createTeamSchema,
  memberSchema,
  MemberSchema,
  UpdateTeamSchema,
} from '../zodSchemas';

export async function createTeam(data: CreateTeamSchema) {
  const supabase = createClient();

  try {
    const validatedFields = createTeamSchema.parse(data);

    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // Get or create user profile
    let {data: profile} = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      // Create profile if it doesn't exist
      const {data: newProfile, error: createError} = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        })
        .select()
        .single();

      if (createError) throw createError;
      profile = newProfile;
    }

    // Create team
    const {data: teamData, error: teamError} = await supabase
      .from('teams')
      .insert({
        name: validatedFields.name,
        created_by: user.id,
      })
      .select('*')
      .maybeSingle();

    if (teamError || !teamData) {
      return {error: teamError?.message || 'Failed to create team'};
    }

    revalidatePath('/team', 'page');

    return {success: true, teamId: teamData.id};
  } catch (error) {
    return {error: 'Failed to create team'};
  }
}

export async function updateTeam(data: UpdateTeamSchema, teamId: string) {
  const supabase = createClient();

  try {
    const validatedFields = createTeamSchema.parse(data);
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // Check if user is a facilitator
    const {data: isAuthorized, error: authError} = await supabase.rpc(
      'check_team_management_permission',
      {
        team_id: teamId,
        user_id: user.id,
      },
    );

    if (authError || !isAuthorized) {
      return {error: 'Not authorized to update team'};
    }

    // Update team name
    const {error: updateError} = await supabase
      .from('teams')
      .update({name: validatedFields.name})
      .eq('id', teamId);

    if (updateError) {
      console.error('Team update error:', updateError);
      return {error: 'Failed to update team'};
    }

    revalidatePath('/team', 'page');
  } catch (error) {
    console.error('Unexpected error:', error);
    return {error: 'Failed to update team'};
  }
}

export async function joinTeamByCode(teamCode: string) {
  const supabase = createClient();
  const locale = await getLocale();
  try {
    const {data: teamId, error: joinError} = await supabase.rpc('join_team_by_code', {
      team_code_input: teamCode.toUpperCase(),
    });

    if (joinError) {
      console.error('Join team error:', joinError);
      return {error: 'Failed to join team'};
    }

    revalidatePath(`/team`, 'page');

    return {success: true, teamId};
  } catch (error) {
    console.error('Unexpected error:', error);
    return {error: 'Failed to join team'};
  }
}

export async function getUserTeams() {
  const supabase = createClient();

  try {
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // First get the teams the user is a member of
    const {data: memberTeams, error: memberError} = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id);

    if (memberError) {
      return {error: 'Failed to fetch teams'};
    }

    const teamIds = memberTeams?.map((t) => t.team_id) || [];

    // Then get the full team data including members
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
      .in('id', teamIds)
      .order('name', {ascending: true});

    if (teamsError) {
      return {error: 'Failed to fetch teams'};
    }

    return {teams: teams || []};
  } catch (error) {
    return {error: 'Failed to fetch teams'};
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  const supabase = createClient();

  try {
    // Get the current user (the one performing the removal)
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // Check if the current user is a facilitator of the team
    const {data: isAuthorized, error: authError} = await supabase.rpc(
      'check_team_management_permission',
      {
        team_id: teamId,
        user_id: user.id,
      },
    );

    if (authError || !isAuthorized) {
      return {error: 'Not authorized to remove team members'};
    }

    // Remove the team member
    const {error: deleteError} = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (deleteError) {
      return {error: 'Failed to remove team member'};
    }

    revalidatePath('/team', 'page');

    return {success: true};
  } catch (error) {
    return {error: 'Failed to remove team member'};
  }
}

export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  newRole: Enums<'team_role'>,
) {
  const supabase = createClient();

  try {
    // Get the current user (the one performing the role change)
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    // Check if the current user is a facilitator of the team
    const {data: isAuthorized, error: authError} = await supabase.rpc(
      'check_team_management_permission',
      {
        team_id: teamId,
        user_id: user.id,
      },
    );

    if (authError || !isAuthorized) {
      return {error: 'Not authorized to change member roles'};
    }

    // Update the member's role
    const {error: updateError} = await supabase
      .from('team_members')
      .update({role: newRole})
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (updateError) {
      return {error: 'Failed to update member role'};
    }

    revalidatePath('/team', 'page');
    return {success: true};
  } catch (error) {
    return {error: 'Failed to update member role'};
  }
}

export async function deleteTeam(teamId: string) {
  const supabase = createClient();

  try {
    // Check if user is a facilitator
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {error: 'User not found'};
    }

    const {data: isAuthorized, error: authError} = await supabase.rpc(
      'check_team_management_permission',
      {
        team_id: teamId,
        user_id: user.id,
      },
    );

    if (authError || !isAuthorized) {
      return {error: 'Not authorized to delete team'};
    }

    // Delete the team (cascade will handle team_members)
    const {error: deleteError} = await supabase.from('teams').delete().eq('id', teamId);

    if (deleteError) {
      return {error: 'Failed to delete team'};
    }

    revalidatePath('/team', 'page');
  } catch (error) {
    return {error: 'Failed to delete team'};
  }
}

export async function getTeamMember(teamId: string, userId: string) {
  const supabase = createClient();

  try {
    const {data: member, error} = await supabase
      .from('team_members')
      .select(
        `
        *,
        profiles (
          first_name,
          last_name,
          avatar_url
        )
      `,
      )
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return {error: 'Failed to get team member'};
    }

    if (!member) {
      return {error: 'Team member not found'};
    }

    return {success: true, member};
  } catch (error) {
    return {error: 'Failed to get team member'};
  }
}

export async function updateTeamMemberProfile(teamId: string, data: MemberSchema) {
  const supabase = createClient();

  const validatedFields = memberSchema.parse(data);
  try {
    const {data, error} = await supabase.rpc('update_team_member_profile', {
      p_team_id: teamId,
      p_profile_name: validatedFields.profile_name,
      p_description: validatedFields.description ?? '',
    });

    if (error) throw error;

    // Revalidate all team member paths
    revalidatePath('/team/[teamId]/member/[id]', 'page');
    revalidatePath('/team', 'page');
    return {success: true, data};
  } catch (error) {
    console.error('Team member profile update error:', error);
    return {error: 'Failed to update team member profile'};
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

    const {data: teamId, error} = await supabase.rpc('join_team_by_invitation', {
      invitation_id: invitationId,
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error accepting invitation:', error);
      return {error: 'Failed to accept invitation'};
    }

    if (!teamId) {
      return {error: 'Invalid invitation'};
    }

    revalidatePath('/team', 'page');
    return {success: true, teamId};
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {error: 'Failed to accept invitation'};
  }
}
