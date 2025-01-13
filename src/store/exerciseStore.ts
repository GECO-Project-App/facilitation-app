import {
  createExercise,
  getExerciseById,
  getExerciseBySlugAndId,
  submitExerciseData,
} from '@/lib/actions/exerciseActions';
import type {CreateExerciseParams, Exercise, Submission} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Json} from '../../database.types';

interface ExerciseState {
  deadline: {
    writingPhase: Date | null;
    reviewingPhase: Date | null;
  };
  exercise: Exercise | null;
  createdExercise: Exercise | null;
  submittedExerciseData: Submission | null;
  status: 'writing' | 'reviewing' | 'results';
  data: JSON | null;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
  createExercise: (newExercise: CreateExerciseParams) => Promise<Exercise>;
  submitExerciseData: (exerciseId: string, data: Json) => Promise<Submission>;
  getExerciseById: (exerciseId: string) => Exercise | null;
  getExerciseBySlugAndId: (slug: string, exerciseId: string) => Exercise | null;
  currentExercise: Exercise | null;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      exercise: null,
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
      getExerciseById: async (exerciseId) => {
        const {exercise} = await getExerciseById(exerciseId);
        set({exercise});
        return exercise;
      },
      submitExerciseData: async (exerciseId, data) => {
        const {submission} = await submitExerciseData({exerciseId, data});
        set({submittedExerciseData: submission});
        return submission;
      },
      getExerciseBySlugAndId: async (slug, exerciseId) => {
        const {exercise} = await getExerciseBySlugAndId(slug, exerciseId);
        set({exercise});
        console.log(exercise);
        return exercise;
      },
      currentExercise: null,
    }),
    {name: 'ExerciseStore', storage: createJSONStorage(() => localStorage)},
  ),
);
