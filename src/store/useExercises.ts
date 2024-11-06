import {getExercisesData} from '@/lib/actions/exerciseActions';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
interface ExerciseType {
  exerciseId: string;
  createdBy: string;
  teamId: string;
  writingDate?: string;
  reviewingDate?: string;
  type?: string;
}

interface ExercisesState {
  exercises: ExerciseType[];
  isLoading: boolean;
  init: (teamId: string) => Promise<void>;
}

export const useExercisesStore = create<ExercisesState>()(
  devtools(
    (set) => ({
      exercises: [],
      isLoading: true,
      init: async (teamId: string) => {
        const {exercises} = await getExercisesData(teamId);
        set({exercises: exercises || []});
      },
    }),
    {name: 'ExercisesStore'},
  ),
);
