import {useTeamStore} from '@/store/teamStore';

export const useGetUsersById = () => {
  const {currentTeam} = useTeamStore();

  const teamMembers = currentTeam?.team_members.map((member) => ({
    id: member.user_id,
    firstName: member.first_name,
    lastName: member.last_name,
  }));

  const getUserById = (id: string) => {
    return teamMembers?.find((member) => member.id === id);
  };

  return {getUserById};
};
