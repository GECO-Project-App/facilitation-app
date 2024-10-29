import {getUserTeams} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
import {Team, TeamMember} from '@/lib/types';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface TeamState {
  currentTeamId: string | null;
  currentTeam: Team | null;
  isLoading: boolean;
  init: () => Promise<void>;
  setCurrentTeamId: (teamId: string | null) => Promise<void>;
  isFacilitator: boolean;
  userProfile: TeamMember | null;
}

export const useTeamStore = create<TeamState>()(
  devtools(
    (set) => ({
      isFacilitator: false,
      currentTeamId: null,
      currentTeam: null, // Initialize as null
      isLoading: true, // Start with loading true
      userProfile: null,
      init: async () => {
        try {
          const supabase = createClient();

          const {teams} = await getUserTeams();

          set({currentTeam: teams?.[0] ?? null, isLoading: false});
          const {
            data: {user},
          } = await supabase.auth.getUser();

          if (user && teams?.[0]) {
            const userProfile = teams[0].team_members?.find((member) => member.user_id === user.id);
            const filteredTeamMembers = teams[0].team_members?.filter(
              (member) => member.user_id !== user.id,
            );
            set({
              userProfile,
              currentTeam: {
                ...teams[0],
                team_members: filteredTeamMembers,
              },
            });
          }

          set({isFacilitator: teams?.[0]?.created_by === user?.id});
        } catch (error) {
          console.error('Error getting default team:', error);
          set({currentTeam: null, isLoading: false});
        }
      },

      setCurrentTeamId: async (teamId) => {
        set({currentTeamId: teamId, isLoading: true});

        if (!teamId) {
          set({currentTeam: null, isLoading: false});
          return;
        }

        try {
          const supabase = createClient();

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
          if (user && team) {
            const userProfile = team.team_members?.find((member) => member.user_id === user.id);
            const filteredTeamMembers = team.team_members?.filter(
              (member) => member.user_id !== user.id,
            );
            set({
              userProfile,
              currentTeam: {
                ...team,
                team_members: filteredTeamMembers,
              },
            });
          }

          set({isFacilitator: team?.created_by === user?.id});
        } catch (error) {
          console.error('Error fetching team:', error);
          set({currentTeam: null, isLoading: false});
        }
      },
    }),
    {name: 'TeamStore'},
  ),
);
