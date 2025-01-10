import {createExercise, submitExerciseData} from '@/lib/actions/exerciseActions';
import type {CreateExerciseParams, Exercise, Submission} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Json} from '../../database.types';

type ExerciseState = {
  deadline: {
    writingPhase: Date | null;
    reviewingPhase: Date | null;
  };
  createdExercise: Exercise | null;
  submittedExerciseData: Submission | null;
  status: 'writing' | 'reviewing' | 'results';
  data: JSON | null;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
  createExercise: (newExercise: CreateExerciseParams) => Promise<Exercise>;
  submitExerciseData: (exerciseId: string, data: Json) => Promise<Submission>;
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      createdExercise: null,
      submittedExerciseData: null,
      status: 'writing',
      data: null,
      setDeadline: (deadline) => set({deadline}),
      createExercise: async (newExercise) => {
        const {exercise} = await createExercise(newExercise);
        set({createdExercise: exercise});
        set({deadline: {writingPhase: null, reviewingPhase: null}});
        return exercise;
      },
      submitExerciseData: async (exerciseId, data) => {
        const {submission} = await submitExerciseData({exerciseId, data});
        set({submittedExerciseData: submission});
        return submission;
      },
    }),
    {name: 'ExerciseStore', storage: createJSONStorage(() => localStorage)},
  ),
);
