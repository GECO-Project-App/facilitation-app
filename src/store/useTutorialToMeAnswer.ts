import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface TutorialToMeType {
  userId: string | null;
  tutorial_to_me_id: string | null;
  strength_1: string | null;
  strength_2: string | null;
  strength_3: string | null;
  weakness_1: string | null;
  weakness_2: string | null;
  weakness_3: string | null;
  communication_1: string | null;
  communication_2: string | null;
  communication_3: string | null;
  setUserId: (userId: string) => void;
  setTutorialToMeId: (tutorial_to_me_id: string) => void;
  setStrength_1: (strength_1: string) => void;
  setStrength_2: (strength_2: string) => void;
  setStrength_3: (strength_3: string) => void;
  setWeakness_1: (weakness_1: string) => void;
  setWeakness_2: (weakness_2: string) => void;
  setWeakness_3: (weakness_3: string) => void;
  setCommunication_1: (communication_1: string) => void;
  setCommunication_2: (communication_2: string) => void;
  setCommunication_3: (communication_3: string) => void;
}

export const useTutorialToMeAnswer = create<TutorialToMeType>()(
  devtools(
    (set) => ({
      userId: null,
      tutorial_to_me_id: null,
      strength_1: null,
      strength_2: null,
      strength_3: null,
      weakness_1: null,
      weakness_2: null,
      weakness_3: null,
      communication_1: null,
      communication_2: null,
      communication_3: null,
      setUserId: (userId) => set(() => ({userId})),
      setTutorialToMeId: (tutorial_to_me_id) => set(() => ({tutorial_to_me_id: tutorial_to_me_id})),
      setStrength_1: (strength_1) => set(() => ({strength_1: strength_1})),
      setStrength_2: (strength_2) => set(() => ({strength_2: strength_2})),
      setStrength_3: (strength_3) => set(() => ({strength_3: strength_3})),
      setWeakness_1: (weakness_1) => set(() => ({weakness_1: weakness_1})),
      setWeakness_2: (weakness_2) => set(() => ({weakness_2: weakness_2})),
      setWeakness_3: (weakness_3) => set(() => ({weakness_3: weakness_3})),
      setCommunication_1: (communication_1) => set(() => ({communication_1: communication_1})),
      setCommunication_2: (communication_2) => set(() => ({communication_2: communication_2})),
      setCommunication_3: (communication_3) => set(() => ({communication_3: communication_3})),
    }),

    {name: 'TutorialToMeAnswerStore'},
  ),
);
