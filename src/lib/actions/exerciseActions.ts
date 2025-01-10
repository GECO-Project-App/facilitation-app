'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {CreateExerciseParams, SubmitExerciseDataParams} from '../types';

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

    revalidatePath(`/exercises/${slug}`);
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
        data,
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
