import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface MemberType {
  nickname: string;
  id: string;
  avatar: string;
}

interface TutorialToMeType {
  members: MemberType[];
  writingDate: Date | undefined;
  writingTime: string | undefined;
  reviewingDate: Date | undefined;
  reviewingTime: string | undefined;
  addMember: (member: MemberType) => void;
  removeMember: (id: string) => void;
  setWritingDate: (date: Date) => void;
  setWritingTime: (time: string) => void;
  setReviewingDate: (date: Date) => void;
  setReviewingTime: (time: string) => void;
}

export const useTutorialToMe = create<TutorialToMeType>()(
  devtools(
    (set) => ({
      members: [],
      writingDate: undefined,
      writingTime: undefined,
      reviewingDate: undefined,
      reviewingTime: undefined,
      addMember: (member) => set((state) => ({members: [...state.members, member]})),
      removeMember: (id) =>
        set((state) => ({members: state.members.filter((member) => member.id !== id)})),
      setWritingDate: (date) => set(() => ({writingDate: date})),
      setWritingTime: (time) => set(() => ({writingTime: time})),
      setReviewingDate: (date) => set(() => ({reviewingDate: date})),
      setReviewingTime: (time) => set(() => ({reviewingTime: time})),
    }),

    {name: 'TutorialToMeStore'},
  ),
);
