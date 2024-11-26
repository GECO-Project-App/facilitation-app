import {useExercisesStore} from '@/store/useExercises';
import {useTutorialToMe} from '@/store/useTutorialToMe';

const ReviewTimeAtHeader = () => {
  const {currentTutorialExerciseId} = useExercisesStore();
  const {reviewingDate, reviewingTime} = useTutorialToMe();

  const reviewingDateExerciseString = useExercisesStore
    .getState()
    .exercises.find((e) => e.exerciseId === currentTutorialExerciseId)?.reviewingDate;

  const reviewingTimeExercise = useExercisesStore
    .getState()
    .exercises.find((e) => e.exerciseId === currentTutorialExerciseId)?.reviewingTime;

  const reviewingDateExercise = reviewingDateExerciseString
    ? new Date(reviewingDateExerciseString)
    : undefined;

  if (reviewingDate && reviewingTime) {
    return (
      <div>
        <div className="bg-white rounded-full p-2 border border-black border-2 text-sm font-bold text-center w-fit mx-auto">
          <p>
            {reviewingDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{reviewingTime}</p>
        </div>
      </div>
    );
  } else if (reviewingDateExercise && reviewingTimeExercise) {
    return (
      <div>
        <div className="bg-white rounded-full p-2 border border-black border-2 text-sm font-bold text-center w-fit mx-auto">
          <p>
            {reviewingDateExercise.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{reviewingTimeExercise}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ReviewTimeAtHeader;
