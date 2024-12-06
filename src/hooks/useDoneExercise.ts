import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';

export const useDoneTutorialExercise = () => {
  let done = false;
  let isAllDone = false;
  const {userProfile} = useTeamStore();
  const {exercises, writingDate, writingTime} = useExercisesStore();
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

  const writingDateInfo = writingDate ? new Date(writingDate) : undefined;
  const writingTimeInfo = writingTime
    ? new Date(`1970-01-01T${writingTime}Z`).toLocaleTimeString()
    : undefined;

  const checkTimePassed = () => {
    let theTimePassed = false;
    if (writingDateInfo) {
      const currentDate = new Date();
      if (currentDate > writingDateInfo) {
        theTimePassed = true;
      } else if (currentDate.toDateString() === writingDateInfo.toDateString() && writingTimeInfo) {
        const currentTime = currentDate.toLocaleTimeString();
        if (currentTime > writingTimeInfo) {
          theTimePassed = true;
        }
      }
    }
    return theTimePassed;
  };

  const theTimePassed = checkTimePassed();

  // TODO: Add review done
  const reviews = currentExercise?.filter((e) => e.reviewed).map((e) => e.replied_id);
  const reviewDone = currentUserId ? reviews?.includes(currentUserId) : false;

  return {done, isAllDone, theTimePassed, reviewDone};
};
