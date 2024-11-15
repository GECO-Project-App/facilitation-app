import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface TutorialToMeType {
  writingDate: Date | undefined;
  writingTime: string | undefined;
  reviewingDate: Date | undefined;
  reviewingTime: string | undefined;
  setWritingDate: (date: Date) => void;
  setWritingTime: (time: string) => void;
  setReviewingDate: (date: Date) => void;
  setReviewingTime: (time: string) => void;
  clearTutorialToMeTimesAndDates: () => void;
}

export const useTutorialToMe = create<TutorialToMeType>()(
  devtools(
    (set) => ({
      writingDate: undefined,
      writingTime: undefined,
      reviewingDate: undefined,
      reviewingTime: undefined,
      setWritingDate: (date) => set(() => ({writingDate: date})),
      setWritingTime: (time) => set(() => ({writingTime: time})),
      setReviewingDate: (date) => set(() => ({reviewingDate: date})),
      setReviewingTime: (time) => set(() => ({reviewingTime: time})),
      clearTutorialToMeTimesAndDates: () =>
        set(() => ({
          writingDate: undefined,
          writingTime: undefined,
          reviewingDate: undefined,
          reviewingTime: undefined,
        })),
    }),

    {name: 'TutorialToMeStore'},
  ),
);
