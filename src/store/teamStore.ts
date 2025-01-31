import {getUserTeams} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {Tables} from '../../database.types';
import {useUserStore} from './userStore';

type TeamWithMembers = Tables<'teams'> & {
  team_members: Array<Tables<'team_members'>> | [];
};
type TeamState = {
  currentTeamId: string | null; // ID of currently selected team
  currentTeam: TeamWithMembers | null; // Currently selected team data with members
  isLoading: boolean; // Loading state indicator
  init: () => Promise<void>; // Initialize the store
  setCurrentTeamId: (teamId: string | null) => Promise<void>; // Change selected team
  facilitator: Tables<'team_members'> | null; // Team facilitator/leader
  isFacilitator: boolean; // Whether current user is facilitator
  userProfile: Tables<'team_members'> | null; // Current user's profile
  userTeams: Tables<'teams'>[];
  updateUserTeams: () => Promise<Tables<'teams'>[] | undefined>;
};

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
      userTeams: [],
      updateUserTeams: async () => {
        const {teams} = await getUserTeams();
        set({userTeams: teams});
        return teams;
      },
      // Initialize the store by loading the user's first team
      init: async () => {
        const supabase = createClient();
        try {
          // Get all teams the user belongs to
          const {teams} = await getUserTeams();

          // Get current user info
          const {
            data: {user},
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return;
          }
          if (teams && teams.length > 0) {
            set({userTeams: teams});
          }

          if (teams?.[0] && user) {
            // Sort team members with current user first, then facilitator, then alphabetically
            const sortedMembers = teams[0].team_members.sort((a, b) => {
              if (!a || !b) return 0;
              if (a.user_id === user.id) return -1;
              if (b.user_id === user.id) return 1;
              if (a.user_id === teams[0].created_by) return -1;
              if (b.user_id === teams[0].created_by) return 1;
              return a?.first_name?.localeCompare(b?.first_name ?? '') ?? 0;
            }) as Array<Tables<'team_members'>>;

            // Update store with first team's data
            set({
              currentTeam: {
                ...teams[0],
                team_members: sortedMembers ?? [],
              },
              facilitator: teams[0].team_members.find(
                (member) => member?.user_id === teams[0].created_by,
              ) as Tables<'team_members'>,
              userProfile: sortedMembers.find((member) => member?.user_id === user.id),
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

        if (teamId === 'new') {
          set({currentTeamId: teamId, isLoading: false});
          return;
        }
        if (!teamId) {
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
            last_name,
            description,
            joined_at,
            profile_name,
            team_id
            )
      `,
            )
            .eq('id', teamId)
            .single();

          if (error) {
            console.log(error);
          }

          const user = useUserStore.getState().user;

          set({currentTeam: team, isLoading: false});

          if (team && user) {
            // Sort team members with current user first, then facilitator, then alphabetically
            const sortedMembers = team.team_members.sort((a, b) => {
              if (!a || !b) return 0;
              if (a.user_id === user.id) return -1;
              if (b.user_id === user.id) return 1;
              if (a.user_id === team.created_by) return -1;
              if (b.user_id === team.created_by) return 1;
              return a?.first_name?.localeCompare(b?.first_name ?? '') ?? 0;
            }) as Array<Tables<'team_members'>>;

            // Update store with new team data
            set({
              currentTeam: {...team, team_members: sortedMembers ?? []},
              facilitator: sortedMembers.find((member) => member?.user_id === team.created_by),
              userProfile: sortedMembers.find((member) => member?.user_id === user.id),

              isFacilitator: team.created_by === user.id,
            });
          }
        } catch (error) {
          set({currentTeam: null, isLoading: false});
        }
      },
    }),
    {name: 'TeamStore'},
  ),
);
