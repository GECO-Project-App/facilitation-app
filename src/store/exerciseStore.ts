'use client';
import {
  createExercise,
  getActiveExercises,
  getExerciseById,
  getExerciseBySlugAndTeamId,
  getPendingUsers,
  getTeamExerciseData,
  getTTMExerciseData,
  getUserExerciseData,
  handleExerciseVote,
  setExerciseDataAsReviewed,
  submitExerciseData,
} from '@/lib/actions/exerciseActions';
import {createClient} from '@/lib/supabase/client';
import type {
  CreateExerciseParams,
  Exercise,
  ExerciseData,
  Exercises,
  ExerciseStage,
  ExerciseStatus,
  Notification,
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
  notifications: Notification[] | null;
  exerciseData: ExerciseData | null;
  teamExerciseData: TeamExerciseData | null;
  exercise: Exercise | null;
  exercises: Exercises | [];
  createdExercise: Exercise | null;
  submittedExerciseData: ExerciseData | null;
  status: 'writing' | 'reviewing' | 'results';
  data: ExerciseData | null;
  reviewedStages: string[];
  ttmData: TTMExerciseData | null;
  pendingUsers: PendingUsers | null;
  getNotifications: () => Promise<Notification[] | null>;
  getPendingUsers: (exerciseId: string, status: ExerciseStatus) => Promise<PendingUsers | null>;
  setExerciseDataAsReviewed: (exerciseId: string) => ExerciseData | null;
  setReviewedStages: (stage: string | null) => void;
  setDeadline: (deadline: {writingPhase: Date | null; reviewingPhase: Date | null}) => void;
  setData: (data: Json) => void;
  createExercise: (newExercise: CreateExerciseParams) => Promise<Exercise>;
  submitExerciseData: (exerciseId: string, data: Json) => Promise<ExerciseData>;
  getExerciseById: (exerciseId: string) => Exercise | null;
  getExerciseBySlugAndTeamId: (slug: string, teamId: string) => Promise<Exercise | null>;
  getUserExerciseData: (exerciseId: string, userId?: string) => ExerciseData | null;
  currentExercise: Exercise | null;
  getTeamExerciseData: (exerciseId: string) => ExerciseData | null;
  getTTMExerciseData: (userId: string) => TTMExerciseData | null;
  handleExerciseVote: (
    exerciseDataId: string,
    category: ExerciseStage,
    voteType: VoteType,
  ) => Promise<void>;
  getActiveExercises: () => Promise<void>;
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      deadline: {
        writingPhase: null,
        reviewingPhase: null,
      },
      notifications: [],
      exerciseData: null,
      teamExerciseData: null,
      exercise: null,
      exercises: [],
      createdExercise: null,
      submittedExerciseData: null,
      reviewedStages: [],
      status: 'writing',
      data: null,
      currentExercise: null,
      ttmData: null,
      pendingUsers: null,
      getNotifications: async () => {
        const supabase = createClient();
        const {data: notifications} = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', {ascending: false})
          .eq('is_read', false);
        set({notifications});
        return notifications;
      },
      getPendingUsers: async (exerciseId, status) => {
        const {pendingUsers} = await getPendingUsers(exerciseId, status);
        set({pendingUsers});
        return pendingUsers;
      },
      setDeadline: (deadline) => set({deadline}),
      setData: (data) => set({data}),
      createExercise: async (newExercise) => {
        const {exercise} = await createExercise(newExercise);
        set({createdExercise: exercise});
        set({deadline: {writingPhase: null, reviewingPhase: null}});
        return exercise;
      },
      setExerciseDataAsReviewed: async (exerciseId) => {
        const {exercise} = await setExerciseDataAsReviewed(exerciseId);
        set({exercise});
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
      getActiveExercises: async () => {
        const {exercises} = await getActiveExercises();
        set({exercises});
      },

      getActiveExercisesByTeamId: (teamId: string) => {
        const filteredExercises = get().exercises.filter(
          (exercise: Exercise) => exercise.team_id === teamId,
        );
        set({exercises: filteredExercises});
      },
    }),
    {
      name: 'ExerciseStore',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        pendingUsers: [],
        getPendingUsers: () => {},
        getNotifications: () => {},
      }),
    },
  ),
);
