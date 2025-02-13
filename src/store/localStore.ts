import {ExerciseStage} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type LocalStore = {
  stage: ExerciseStage;
  reviewedStages: string[];
  reviewedCards: string[];
  question: string | null;
  setReviewedStages: (stage: string[]) => void;
  setReviewedCards: (cardIds: string[]) => void;
  addReviewedCard: (cardId: string) => void;
  setStage: (stage: ExerciseStage) => void;
  setQuestion: (question: string) => void;
};

export const useLocalStore = create<LocalStore>()(
  persist(
    (set, get) => ({
      stage: null,
      reviewedStages: [],
      reviewedCards: [],
      question: null,
      setReviewedStages: (stage: string[]) => set({reviewedStages: stage}),
      setReviewedCards: (cardIds: string[]) => set({reviewedCards: cardIds}),
      addReviewedCard: (cardId: string) =>
        set((state) => ({
          reviewedCards: [...state.reviewedCards, cardId],
        })),
      setStage: (stage: ExerciseStage) => set({stage}),
      setQuestion: (question: string) => set({question}),
    }),
    {
      name: 'local-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
