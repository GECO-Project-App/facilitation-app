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
  reviewingDate: string;
  isActive: boolean;
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
  isLoading: boolean;
  init: (teamId: string) => Promise<void>;
}

export const useExercisesStore = create<ExercisesState>()(
  devtools(
    (set) => ({
      exercises: [],
      currentTutorialExerciseId: undefined,
      isLoading: true,
      init: async (teamId: string) => {
        const {exercises} = await getExercisesData(teamId);
        set({exercises: exercises as ExerciseType[]});
        set({
          currentTutorialExerciseId: exercises?.find(
            (e) => e.isActive && e.type === 'tutorial_to_me',
          )?.exerciseId,
        });
      },
    }),
    {name: 'ExercisesStore'},
  ),
);
