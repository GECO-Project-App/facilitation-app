import {getExercisesData} from '@/lib/actions/exerciseActions';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

// interface AnswersDataType {
//   replied_id: string;
//   strengths: string;
//   weaknesses: string;
//   communications: string;
// }

interface ExerciseType {
  exerciseId: string;
  createdBy: string;
  teamId: string;
  writingDate: string;
  writingTime: string;
  reviewingDate: string;
  reviewingTime: string;
  isActive: boolean;
  reviewed: boolean;
  type: 'tutorial_to_me';
  replied_id: string;
  answers: {
    strengths: string;
    weaknesses: string;
    communications: string;
  };
}

interface ExercisesState {
  exercises: ExerciseType[];
  currentTutorialExerciseId: string | undefined;
  currentTutorialExerciseCreatedBy: string | undefined;
  writingDate: string | undefined;
  writingTime: string | undefined;
  reviewingDate: string | undefined;
  reviewingTime: string | undefined;
  isLoading: boolean;
  init: (teamId: string) => Promise<void>;
}

export const useExercisesStore = create<ExercisesState>()(
  devtools(
    (set) => ({
      exercises: [],
      currentTutorialExerciseId: undefined,
      currentTutorialExerciseCreatedBy: undefined,
      writingDate: undefined,
      writingTime: undefined,
      reviewingDate: undefined,
      reviewingTime: undefined,
      isLoading: true,
      init: async (teamId: string) => {
        const {exercises} = await getExercisesData(teamId);
        set({exercises: exercises as ExerciseType[]});
        set({
          currentTutorialExerciseId: exercises?.find(
            (e) => e.isActive && e.type === 'tutorial_to_me',
          )?.exerciseId,
        });
        set({
          currentTutorialExerciseCreatedBy: exercises?.find(
            (e) => e.isActive && e.type === 'tutorial_to_me',
          )?.createdBy,
        });
        set({
          writingDate: exercises?.find(
            (e) =>
              e.isActive && e.type === 'tutorial_to_me' && e.writingDate && e.writingDate !== '',
          )?.writingDate,
        });
        set({
          writingTime: exercises?.find(
            (e) =>
              e.isActive && e.type === 'tutorial_to_me' && e.writingTime && e.writingTime !== '',
          )?.writingTime,
        });
        set({
          reviewingDate: exercises?.find(
            (e) =>
              e.isActive &&
              e.type === 'tutorial_to_me' &&
              e.reviewingDate &&
              e.reviewingDate !== '',
          )?.reviewingDate,
        });
        set({
          reviewingTime: exercises?.find(
            (e) =>
              e.isActive &&
              e.type === 'tutorial_to_me' &&
              e.reviewingTime &&
              e.reviewingTime !== '',
          )?.reviewingTime,
        });
      },
    }),
    {name: 'ExercisesStore'},
  ),
);
