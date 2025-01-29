import {ExerciseStage} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type LocalStore = {
  stage: ExerciseStage;
  reviewedStages: string[];
  reviewedCards: string[];
  setReviewedStages: (stage: string[]) => void;
  setReviewedCards: (cardIds: string[]) => void;
  addReviewedCard: (cardId: string) => void;
  setStage: (stage: ExerciseStage) => void;
};

export const useLocalStore = create<LocalStore>()(
  persist(
    (set, get) => ({
      stage: null,
      reviewedStages: [],
      reviewedCards: [],
      setReviewedStages: (stage: string[]) => set({reviewedStages: stage}),
      setReviewedCards: (cardIds: string[]) => set({reviewedCards: cardIds}),
      addReviewedCard: (cardId: string) =>
        set((state) => ({
          reviewedCards: [...state.reviewedCards, cardId],
        })),
      setStage: (stage: ExerciseStage) => set({stage}),
    }),
    {
      name: 'local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
