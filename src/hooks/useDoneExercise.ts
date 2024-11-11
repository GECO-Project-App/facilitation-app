import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';

export const useDoneTutorialExercise = () => {
  let done = false;
  const {userProfile} = useTeamStore();
  const {exercises} = useExercisesStore();
  const currentTutorialExerciseId = exercises.find(
    (e) => e.type === 'tutorial_to_me' && e.isActive,
  )?.exerciseId;

  const currentExercise = exercises.filter((e) => e.exerciseId === currentTutorialExerciseId);
  const currentUserId = userProfile?.user_id;

  const didIt = currentExercise.find((ce) => ce.replied_id === currentUserId);
  if (didIt) {
    done = true;
  }
  return {done};
};
