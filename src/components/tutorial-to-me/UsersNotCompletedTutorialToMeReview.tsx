'use client';
import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';

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

const UsersNotCompletedTutorialToMeReview = () => {
  const {currentTeam} = useTeamStore();
  const {currentTutorialExerciseId, exercises} = useExercisesStore();

  const teamMembers = currentTeam?.team_members.map((member) => ({
    id: member.user_id,
    firstName: member.first_name,
    lastName: member.last_name,
  }));

  const doneUsersId = exercises
    .filter((e) => e.exerciseId === currentTutorialExerciseId && e.reviewed)
    .map((e) => e.replied_id);

  const teamMembersNotCompletedTask = teamMembers
    ? getTeamMembersNotCompletedTask(teamMembers, doneUsersId)
    : [];
  return (
    <div className="flex">
      {teamMembersNotCompletedTask.length > 0
        ? teamMembersNotCompletedTask.map((member) => (
            <div key={member.id}>
              {member.firstName} {member.lastName},&nbsp;
            </div>
          ))
        : null}
    </div>
  );
};

export default UsersNotCompletedTutorialToMeReview;
