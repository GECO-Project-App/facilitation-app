'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {
  CreateExerciseParams,
  ExerciseStage,
  ExerciseStatus,
  SubmitExerciseDataParams,
  VoteType,
} from '../types';

export async function createExercise({
  teamId,
  slug,
  reviewType = 'vote',
  deadline,
}: CreateExerciseParams) {
  const supabase = createClient();

  try {
    // Get current user
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Validate deadline format
    if (!deadline || typeof deadline !== 'object' || !deadline.writing || !deadline.reviewing) {
      throw new Error('Invalid deadline format');
    }

    // Create exercise
    const {data: exercise, error: exerciseError} = await supabase
      .from('exercises')
      .insert({
        team_id: teamId,
        created_by: user.id,
        slug,
        review_type: reviewType,
        deadline: {
          writing: deadline.writing,
          reviewing: deadline.reviewing,
        },
        status: 'writing',
      })
      .select()
      .single();

    if (exerciseError) {
      console.error('Supabase error details:', exerciseError);
      throw exerciseError;
    }
    if (!exercise) throw new Error('Failed to create exercise');

    revalidatePath(`/exercises/${slug}?id=${exercise.id}&status=${exercise.status}`);
    return {exercise};
  } catch (error) {
    console.error('Error creating exercise:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function submitExerciseData({exerciseId, data}: SubmitExerciseDataParams) {
  const supabase = createClient();
  try {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const {data: submission, error} = await supabase
      .from('exercise_data')
      .insert({
        exercise_id: exerciseId,
        author_id: user.id,
        data: data,
        is_reviewed: false,
      })
      .select()
      .single();

    if (error) throw error;
    if (!submission) throw new Error('Failed to submit exercise data');

    revalidatePath(`/exercises`);
    return {submission};
  } catch (error) {
    console.error('Error submitting exercise data:', error);
    throw error;
  }
}

export async function getExerciseById(exerciseId: string) {
  const supabase = createClient();
  const {data: exercise, error} = await supabase
    .from('exercises')
    .select()
    .eq('id', exerciseId)
    .single();
  return {exercise, error};
}

export const getExerciseBySlugAndTeamId = async (slug: string, teamId: string) => {
  const supabase = createClient();
  const {data: exercise, error} = await supabase
    .from('exercises')
    .select()
    .eq('slug', slug)
    .eq('team_id', teamId)
    .neq('status', 'completed')
    .order('created_at', {ascending: false})
    .limit(1)
    .single();

  return {exercise, error};
};

export const getUserExerciseData = async (exerciseId: string) => {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data: exerciseData, error} = await supabase
    .from('exercise_data')
    .select()
    .eq('author_id', user.id)
    .eq('exercise_id', exerciseId);
  return {exerciseData, error};
};

export const getTeamExerciseData = async (exerciseId: string) => {
  const supabase = createClient();
  const {data, error} = await supabase.rpc('get_team_exercise_data', {
    p_exercise_id: exerciseId,
  });

  return {exerciseData: data, error};
};

export async function getPendingUsers(exerciseId: string, status: ExerciseStatus) {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const {data: pendingUsers, error} = await supabase.rpc('get_pending_users', {
      p_exercise_id: exerciseId,
      p_status: status,
    });

    if (error) throw error;

    return {pendingUsers};
  } catch (error) {
    console.error('Error getting pending submissions:', error);
    return {error: 'Failed to get pending submissions'};
  }
}

export const setExerciseDataAsReviewed = async (exerciseId: string) => {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data: exercise, error} = await supabase
    .from('exercise_data')
    .update({is_reviewed: true})
    .eq('exercise_id', exerciseId)
    .eq('author_id', user.id);
  return {exercise, error};
};

export const getTTMExerciseData = async (userId: string) => {
  const supabase = createClient();

  try {
    const {data: ttmData, error} = await supabase.rpc('get_ttm_exercise_data', {
      p_user_id: userId,
    });

    if (error) throw error;

    return {ttmData: ttmData[0] || null, error: null};
  } catch (error) {
    console.error('Error fetching TTM exercise data:', error);
    return {ttmData: null, error};
  }
};

export const updateExerciseVote = async (cardId: string, stage: string, isYesVote: boolean) => {
  const supabase = createClient();
  try {
    const voteUpdate = isYesVote ? {yes: 1} : {no: 1};
    await supabase
      .from('exercise_data')
      .update({
        [`data:${stage}:vote:${isYesVote ? 'yes' : 'no'}`]: voteUpdate,
      })
      .eq('id', cardId);
  } catch (error) {
    console.error('Error updating vote:', error);
  }
};

export async function handleExerciseVote(
  exerciseDataId: string,
  category: ExerciseStage,
  voteType: VoteType,
) {
  const supabase = createClient();
  try {
    if (!category) {
      throw new Error('Invalid category');
    }
    const {data, error} = await supabase.rpc('increment_exercise_vote', {
      p_exercise_data_id: exerciseDataId,
      p_json_path: [category, 'vote', voteType],
    });

    if (error) {
      throw new Error(`Error incrementing vote: ${error.message}`);
    }

    return {success: true, data};
  } catch (error) {
    console.error('Failed to increment vote:', error);
    return {success: false, error: 'Failed to increment vote'};
  }
}

export async function getActiveExercises() {
  const supabase = createClient();

  try {
    const {data, error} = await supabase.rpc('get_active_exercises');

    if (error) throw error;
    return {exercises: data, error: null};
  } catch (error) {
    console.error('Error fetching active exercises:', error);
    return {exercises: null, error};
  }
}

export const getUserTeamActivities = async () => {
  const supabase = createClient();
  const {data, error} = await supabase.rpc('get_user_team_exercises');
  return {data, error};
};
