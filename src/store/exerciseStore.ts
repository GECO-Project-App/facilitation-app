'use client';
import {
  createExercise,
  getExerciseById,
  getExerciseBySlugAndId,
  getExerciseBySlugAndTeamId,
  getPendingUsers,
  getTeamExerciseData,
  getTTMExerciseData,
  getUserExerciseData,
  handleExerciseVote,
  setExerciseDataAsReviewed,
  submitExerciseData,
} from '@/lib/actions/exerciseActions';
import type {
  CreateExerciseParams,
  Exercise,
  ExerciseData,
  ExerciseStage,
  ExerciseStatus,
  PendingUsers,
  TeamExerciseData,
  TTMExerciseData,
  VoteType,
} from '@/lib/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Json} from '../../database.types';

type ExerciseState = {
  deadline: {
    writingPhase: Date | null;
    reviewingPhase: Date | null;
  };
  pendingUsers: PendingUsers | [];
  exerciseData: ExerciseData | null;
  teamExerciseData: TeamExerciseData | null;
  exercise: Exercise | null;
  createdExercise: Exercise | null;
  submittedExerciseData: ExerciseData | null;
  status: 'writing' | 'reviewing' | 'results';
  data: ExerciseData | null;
  reviewedStages: string[];
  ttmData: TTMExerciseData | null;
  setReviewedStages: (stage: string | null) => void;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
  setData: (data: Json) => void;
  createExercise: (newExercise: CreateExerciseParams) => Promise<Exercise>;
  submitExerciseData: (exerciseId: string, data: Json) => Promise<ExerciseData>;
  getExerciseById: (exerciseId: string) => Exercise | null;
  getExerciseBySlugAndId: (slug: string, exerciseId: string) => Exercise | null;
  getExerciseBySlugAndTeamId: (slug: string, teamId: string) => Exercise | null;
  getUserExerciseData: (exerciseId: string, userId?: string) => ExerciseData | null;
  currentExercise: Exercise | null;
  getPendingUsers: (exerciseId: string, status: ExerciseStatus) => PendingUsers | null;
  getTeamExerciseData: (exerciseId: string) => ExerciseData | null;
  setExerciseDataAsReviewed: (exerciseId: string) => ExerciseData | null;
  getTTMExerciseData: (userId: string) => TTMExerciseData | null;
  handleExerciseVote: (
    exerciseDataId: string,
    category: ExerciseStage,
    voteType: VoteType,
  ) => Promise<void>;
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      pendingUsers: [],
      exerciseData: null,
      teamExerciseData: null,
      exercise: null,
      createdExercise: null,
      submittedExerciseData: null,
      reviewedStages: [],
      status: 'writing',
      data: null,
      currentExercise: null,
      ttmData: null,
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

        return exercise;
      },
      getExerciseBySlugAndTeamId: async (slug, teamId) => {
        const {exercise} = await getExerciseBySlugAndTeamId(slug, teamId);
        set({exercise});

        return exercise;
      },
      getUserExerciseData: async (exerciseId) => {
        const {exerciseData} = await getUserExerciseData(exerciseId);
        set({exerciseData});
        return exerciseData;
      },
      getPendingUsers: async (exerciseId, status) => {
        const {pendingUsers} = await getPendingUsers(exerciseId, status);
        set({pendingUsers});
        return pendingUsers;
      },
      setExerciseDataAsReviewed: async (exerciseId) => {
        const {exercise} = await setExerciseDataAsReviewed(exerciseId);
        set({exercise});
        return exercise;
      },
      getTeamExerciseData: async (exerciseId) => {
        const {exerciseData} = await getTeamExerciseData(exerciseId);
        set({teamExerciseData: exerciseData});
        return exerciseData;
      },
      getTTMExerciseData: async (userId) => {
        const {ttmData} = await getTTMExerciseData(userId);
        set({ttmData});

        return ttmData;
      },
      setReviewedStages: (stage) =>
        set({
          reviewedStages: stage ? [...get().reviewedStages, stage] : [],
        }),
      handleExerciseVote: async (exerciseDataId, category, voteType) => {
        const {success, data} = await handleExerciseVote(exerciseDataId, category, voteType);
        if (!success) {
          throw new Error('Failed to increment vote');
        }
      },
    }),

    {
      name: 'ExerciseStore',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
