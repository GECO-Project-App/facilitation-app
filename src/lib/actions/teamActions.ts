'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {CreateTeamSchema, createTeamSchema} from '../zodSchemas';

export async function createTeam(data: CreateTeamSchema) {
  const supabase = createClient();

  try {
    const validatedFields = createTeamSchema.parse(data);
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get or create user profile
    let {data: profile} = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.user.id)
      .maybeSingle();

    if (!profile) {
      // Create profile if it doesn't exist
      const {data: newProfile, error: createError} = await supabase
        .from('profiles')
        .insert({
          id: user.user.id,
          first_name: user.user.user_metadata?.first_name || '',
          last_name: user.user.user_metadata?.last_name || '',
          avatar_url: user.user.user_metadata?.avatar_url || '',
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
        created_by: user.user.id,
      })
      .select('*')
      .maybeSingle();

    if (teamError || !teamData) {
      console.log(teamError);
      return {error: teamError?.message || 'Failed to create team'};
    }

    revalidatePath('/team', 'page');

    return {success: true, teamId: teamData.id};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to create team'};
  }
}

export async function joinTeamByCode(teamCode: string) {
  const supabase = createClient();

  try {
    // Get the current user
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get the user's profile data first
    const {data: profile, error: profileError} = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      console.log('Profile lookup error:', profileError);
      return {error: 'Failed to get profile data'};
    }

    // Find the team with the given code
    const {data: teamData, error: teamError} = await supabase
      .from('teams')
      .select('id')
      .eq('team_code', teamCode.toUpperCase())
      .maybeSingle();

    if (teamError) {
      console.log('Team lookup error:', teamError);
      return {error: 'Failed to lookup team'};
    }

    if (!teamData) {
      return {error: 'Invalid team code'};
    }

    // Check if user is already a member
    const {data: existingMember, error: memberCheckError} = await supabase
      .from('team_members')
      .select()
      .eq('team_id', teamData.id)
      .eq('user_id', user.user.id)
      .maybeSingle();

    if (existingMember) {
      return {error: 'You are already a member of this team'};
    }

    // Add user as a member with profile data
    const {error: insertError} = await supabase.from('team_members').insert({
      team_id: teamData.id,
      user_id: user.user.id,
      role: 'member',
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
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

    // First get the teams the user is a member of
    const {data: memberTeams, error: memberError} = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.user.id);

    if (memberError) {
      console.log('Error fetching member teams:', memberError);
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
      console.log('Error fetching teams:', teamsError);
      return {error: 'Failed to fetch teams'};
    }

    return {teams: teams || []};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to fetch teams'};
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  const supabase = createClient();

  try {
    // Get the current user (the one performing the removal)
    const {data: currentUser, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if the current user is a facilitator of the team
    const {data: facilitator, error: facilitatorError} = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', currentUser.user.id)
      .maybeSingle();

    if (facilitatorError) {
      console.log('Facilitator check error:', facilitatorError);
      return {error: 'Failed to verify permissions'};
    }

    if (!facilitator) {
      return {error: 'Not a team member'};
    }

    // Only allow facilitators to remove members (or users removing themselves)
    if (facilitator.role !== 'facilitator' && currentUser.user.id !== userId) {
      return {error: 'Not authorized to remove team members'};
    }

    // Remove the team member
    const {error: deleteError} = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (deleteError) {
      console.log('Remove member error:', deleteError);
      return {error: 'Failed to remove team member'};
    }

    revalidatePath('/team', 'page');
    return {success: true};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to remove team member'};
  }
}

export const updateTeamMemberAvatar = async (svgString: string) => {
  const supabase = createClient();
  const {data: user, error: userError} = await supabase.auth.getUser();

  if (userError) throw userError;

  const blob = new Blob([svgString], {type: 'image/svg+xml'});
  const file = new File([blob], 'avatar.svg', {type: 'image/svg+xml'});

  const {data, error: uploadError} = await supabase.storage
    .from('avatars')
    .upload(`avatar-${user.user.id}.svg`, file, {
      cacheControl: '3600',
      upsert: true, // TODO: this causes  message: 'new row violates row-level security policy'
    });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }
  return data.path;
};

export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  newRole: 'facilitator' | 'member',
) {
  const supabase = createClient();

  try {
    // Get the current user (the one performing the role change)
    const {data: currentUser, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if the current user is a facilitator of the team
    const {data: facilitator, error: facilitatorError} = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', currentUser.user.id)
      .single();

    if (facilitatorError || facilitator?.role !== 'facilitator') {
      return {error: 'Not authorized to change member roles'};
    }

    // Update the member's role
    const {error: updateError} = await supabase
      .from('team_members')
      .update({role: newRole})
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (updateError) {
      console.log('Role update error:', updateError);
      return {error: 'Failed to update member role'};
    }

    revalidatePath('/team', 'page');
    return {success: true};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to update member role'};
  }
}

export async function deleteTeam(teamId: string) {
  const supabase = createClient();

  try {
    // Check if user is a facilitator
    const {data: currentUser, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const {data: facilitator, error: facilitatorError} = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', currentUser.user.id)
      .single();

    if (facilitatorError || facilitator?.role !== 'facilitator') {
      return {error: 'Not authorized to delete team'};
    }

    // Delete the team (cascade will handle team_members)
    const {error: deleteError} = await supabase.from('teams').delete().eq('id', teamId);

    if (deleteError) {
      console.log('Team deletion error:', deleteError);
      return {error: 'Failed to delete team'};
    }

    revalidatePath('/team', 'page');
    return {success: true};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to delete team'};
  }
}
