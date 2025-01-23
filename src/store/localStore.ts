import {ExerciseStage} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type LocalStore = {
  stage: ExerciseStage;
  setStage: (stage: ExerciseStage) => void;
};

export const useLocalStore = create<LocalStore>()(
  persist(
    (set) => ({
      stage: null,
      setStage: (
        stage: 'start' | 'stop' | 'continue' | 'strengths' | 'weaknesses' | 'communication' | null,
      ) => set({stage}),
    }),
    {
      name: 'local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
