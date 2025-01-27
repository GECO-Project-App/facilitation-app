'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {CreateExerciseParams, ExerciseStatus, SubmitExerciseDataParams} from '../types';

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

    // Create exercise
    const {data: exercise, error: exerciseError} = await supabase
      .from('exercises')
      .insert({
        team_id: teamId,
        created_by: user.id,
        slug,
        review_type: reviewType,
        deadline: deadline,
        status: 'writing',
      })
      .select()
      .single();

    if (exerciseError) throw exerciseError;
    if (!exercise) throw new Error('Failed to create exercise');

    revalidatePath(`/exercises/${slug}?id=${exercise.id}&status=${exercise.status}`);
    return {exercise};
  } catch (error) {
    console.error('Error creating exercise:', error);
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
export const getExerciseBySlugAndId = async (slug: string, exerciseId: string) => {
  const supabase = createClient();
  const {data: exercise, error} = await supabase
    .from('exercises')
    .select()
    .eq('slug', slug)
    .eq('id', exerciseId)
    .single();
  return {exercise, error};
};

export const getExerciseBySlugAndTeamId = async (slug: string, teamId: string) => {
  const supabase = createClient();
  const {data: exercise, error} = await supabase
    .from('exercises')
    .select()
    .eq('slug', slug)
    .eq('team_id', teamId)
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

// export const voteOnExerciseData = async (
//   exerciseId: string,
//   field: 'strengths' | 'weaknesses' | 'communication',
//   voteType: 'yes' | 'no',
// ) => {
//   const supabase = createClient();

//   const {data, error} = await supabase.rpc('vote_on_exercise', {
//     p_exercise_id: exerciseId,
//     p_field: field,
//     p_vote_type: voteType,
//   });

//   if (error) throw error;
//   revalidatePath('/exercises');
//   return {data, error};
// };

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
