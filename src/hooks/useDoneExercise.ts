import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';

export const useDoneTutorialExercise = () => {
  let done = false;
  let isAllDone = false;
  const {userProfile} = useTeamStore();
  const {exercises} = useExercisesStore();
  const {currentTeam} = useTeamStore();
  const currentTutorialExerciseId =
    exercises?.find((e) => e.type === 'tutorial_to_me' && e.isActive)?.exerciseId ?? '';

  const currentExercise = exercises?.filter((e) => e.exerciseId === currentTutorialExerciseId);
  const currentUserId = userProfile?.user_id;

  const didIt = currentExercise?.find((ce) => ce.replied_id === currentUserId);
  if (didIt) {
    done = true;
  }
  const allMembersTeamIds = currentTeam?.team_members.map((m) => m.user_id);
  if (allMembersTeamIds?.length === currentExercise?.length) {
    isAllDone = true;
  }
  return {done, isAllDone};
};
