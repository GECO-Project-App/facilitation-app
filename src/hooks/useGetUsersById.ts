import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';

export const useGetUsersById = () => {
  const {currentTeam} = useTeamStore();
  const {currentTutorialExerciseId, exercises} = useExercisesStore();

  const teamMembers = currentTeam?.team_members.map((member) => ({
    id: member.user_id,
    firstName: member.first_name,
    lastName: member.last_name,
  }));

  const doneUsersId = exercises
    .filter((e) => e.exerciseId === currentTutorialExerciseId)
    .map((e) => e.replied_id);

  const doneUsersIdReviewed = exercises
    .filter((e) => e.exerciseId === currentTutorialExerciseId && e.reviewed)
    .map((e) => e.replied_id);

  const getTeamMembersNotCompletedTask = (
    teamMembers: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    }[],
    doneUsersId: string[],
  ) => {
    return teamMembers.filter((member) => !doneUsersId.includes(member.id));
  };

  const getUserById = (id: string) => {
    return teamMembers?.find((member) => member.id === id);
  };

  const teamMembersNotCompletedTask = teamMembers
    ? getTeamMembersNotCompletedTask(teamMembers, doneUsersId)
    : [];

  const teamMembersNotCompletedReviewed = teamMembers
    ? getTeamMembersNotCompletedTask(teamMembers, doneUsersIdReviewed)
    : [];

  return {getUserById, teamMembersNotCompletedTask, teamMembersNotCompletedReviewed};
};
