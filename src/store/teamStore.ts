// Import necessary dependencies
import {getUserTeams} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
import {Team, TeamMember} from '@/lib/types';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface TeamState {
  currentTeamId: string | null; // ID of currently selected team
  currentTeam: Team | null; // Currently selected team data
  isLoading: boolean; // Loading state indicator
  init: () => Promise<void>; // Initialize the store
  setCurrentTeamId: (teamId: string | null) => Promise<void>; // Change selected team
  facilitator: TeamMember | null; // Team facilitator/leader
  isFacilitator: boolean; // Whether current user is facilitator
  userProfile: TeamMember | null; // Current user's profile
}

// Create the team store using Zustand
export const useTeamStore = create<TeamState>()(
  devtools(
    (set) => ({
      isFacilitator: false,
      facilitator: null,
      currentTeamId: null,
      currentTeam: null,
      isLoading: true,
      userProfile: null,

      // Initialize the store by loading the user's first team
      init: async () => {
        try {
          const supabase = createClient();

          // Get all teams the user belongs to
          const {teams} = await getUserTeams();

          // Get current user info
          const {
            data: {user},
          } = await supabase.auth.getUser();

          if (teams?.[0] && user) {
            // Sort team members with current user first, then facilitator, then alphabetically
            const sortedMembers = teams[0].team_members.sort((a, b) => {
              if (a.user_id === user.id) return -1;
              if (b.user_id === user.id) return 1;
              if (a.user_id === teams[0].created_by) return -1;
              if (b.user_id === teams[0].created_by) return 1;
              return a.first_name.localeCompare(b.first_name);
            });

            // Update store with first team's data
            set({
              currentTeam: {
                ...teams[0],
                team_members: sortedMembers,
              },
              facilitator: teams[0].team_members.find(
                (member) => member.user_id === teams[0].created_by,
              ),
              userProfile: sortedMembers.find((member) => member.user_id === user.id),
              isFacilitator: teams[0].created_by === user.id,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error getting default team:', error);
          set({currentTeam: null, isLoading: false});
        }
      },

      // Change the currently selected team
      setCurrentTeamId: async (teamId) => {
        // Clear team data if no teamId provided
        if (!teamId || teamId === 'new') {
          set({currentTeam: null, isLoading: false});
          return;
        }
        set({currentTeamId: teamId, isLoading: true});

        try {
          const supabase = createClient();

          // Fetch detailed team data including members
          const {data: team, error} = await supabase
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
            .eq('id', teamId)
            .single();

          if (error) throw error;
          const {
            data: {user},
          } = await supabase.auth.getUser();

          set({currentTeam: team, isLoading: false});

          if (team && user) {
            // Sort team members with current user first, then facilitator, then alphabetically
            const sortedMembers = team.team_members.sort((a, b) => {
              if (a.user_id === user.id) return -1;
              if (b.user_id === user.id) return 1;
              if (a.user_id === team.created_by) return -1;
              if (b.user_id === team.created_by) return 1;
              return a.first_name.localeCompare(b.first_name);
            });

            // Update store with new team data
            set({
              currentTeam: {...team, team_members: sortedMembers},
              facilitator: sortedMembers.find((member) => member.user_id === team.created_by),
              userProfile: sortedMembers.find((member) => member.user_id === user.id),

              isFacilitator: team.created_by === user.id,
            });
          }
        } catch (error) {
          console.error('Error fetching team:', error);
          set({currentTeam: null, isLoading: false});
        }
      },
    }),
    {name: 'TeamStore'},
  ),
);
