import {
  createExercise,
  getExerciseById,
  getExerciseBySlugAndId,
  getExerciseBySlugAndTeamId,
  getExerciseDataByAuthorAndExerciseId,
  submitExerciseData,
} from '@/lib/actions/exerciseActions';
import type {CreateExerciseParams, Exercise, ExerciseData} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Json} from '../../database.types';

type ExerciseState = {
  deadline: {
    writingPhase: Date | null;
    reviewingPhase: Date | null;
  };
  exerciseData: ExerciseData | null;
  exercise: Exercise | null;
  createdExercise: Exercise | null;
  submittedExerciseData: ExerciseData | null;
  status: 'writing' | 'reviewing' | 'results';
  data: ExerciseData | null;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
  setData: (data: Json) => void;
  createExercise: (newExercise: CreateExerciseParams) => Promise<Exercise>;
  submitExerciseData: (exerciseId: string, data: Json) => Promise<ExerciseData>;
  getExerciseById: (exerciseId: string) => Exercise | null;
  getExerciseBySlugAndId: (slug: string, exerciseId: string) => Exercise | null;
  getExerciseBySlugAndTeamId: (slug: string, teamId: string) => Exercise | null;
  getExerciseDataByAuthorAndExerciseId: (exerciseId: string) => ExerciseData | null;
  currentExercise: Exercise | null;
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      exerciseData: null,
      exercise: null,
      createdExercise: null,
      submittedExerciseData: null,
      status: 'writing',
      data: null,
      setDeadline: (deadline) => set({deadline}),
      setData: (data) => set({data}),
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
      getExerciseBySlugAndTeamId: async (slug, teamId) => {
        const {exercise} = await getExerciseBySlugAndTeamId(slug, teamId);
        set({exercise});
        console.log(exercise);
        return exercise;
      },
      getExerciseDataByAuthorAndExerciseId: async (exerciseId) => {
        const {exerciseData} = await getExerciseDataByAuthorAndExerciseId(exerciseId);
        set({exerciseData});
        return exerciseData;
      },
      currentExercise: null,
    }),
    {name: 'ExerciseStore', storage: createJSONStorage(() => localStorage)},
  ),
);
