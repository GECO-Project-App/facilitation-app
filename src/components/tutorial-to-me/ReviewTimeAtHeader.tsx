import {useExercisesStore} from '@/store/useExercises';
import {useTutorialToMe} from '@/store/useTutorialToMe';

const ReviewTimeAtHeader = () => {
  const {currentTutorialExerciseId} = useExercisesStore();
  const {writingDate, writingTime} = useTutorialToMe();

  const writingDateExerciseString = useExercisesStore
    .getState()
    .exercises.find((e) => e.exerciseId === currentTutorialExerciseId)?.writingDate;

  const writingTimeExercise = useExercisesStore
    .getState()
    .exercises.find((e) => e.exerciseId === currentTutorialExerciseId)?.writingTime;

  const writingDateExercise = writingDateExerciseString
    ? new Date(writingDateExerciseString)
    : undefined;

  if (writingDate && writingTime) {
    return (
      <div>
        <div className="bg-white rounded-full p-2 border border-black border-2 text-sm font-bold text-center w-fit mx-auto">
          <p>
            {writingDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{writingTime}</p>
        </div>
      </div>
    );
  } else if (writingDateExercise && writingTimeExercise) {
    return (
      <div>
        <div className="bg-white rounded-full p-2 border border-black border-2 text-sm font-bold text-center w-fit mx-auto">
          <p>
            {writingDateExercise.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{writingTimeExercise}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ReviewTimeAtHeader;
