import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Tables} from '../../database.types';

type ExerciseType = {
  deadline: {
    writingPhase: Date | null;
    reviewingPhase: Date | null;
  };
  data: JSON | null;
  participants: Tables<'profiles'>[] | Tables<'teams'>;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
};

export const useExerciseStore = create<ExerciseType>()(
  persist(
    (set) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      data: null,
      participants: [],
      setDeadline: (deadline) => set({deadline}),
    }),
    {name: 'ExerciseStore', storage: createJSONStorage(() => localStorage)},
  ),
);
