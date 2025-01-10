'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {CreateExerciseParams, SubmitExerciseDataParams} from '../types';

export async function getTutorialToMeExercisesData(teamId: string) {
  const supabase = createClient();

  try {
    const {data: exercises, error: exercisesError} = await supabase
      .from('tutorial_to_me')
      .select()
      .eq('team_id', teamId)
      .eq('is_active', true);

    if (exercisesError) throw exercisesError;

    const currentDate = new Date();

    const exercisesData = await Promise.all(
      exercises.map(async (e) => {
        const reviewingDateInfo = e.reviewing_date ? new Date(e.reviewing_date) : null;
        const reviewingTimeInfo = e.reviewing_time
          ? new Date(`1970-01-01T${e.reviewing_time}Z`).toLocaleTimeString()
          : null;

        let isActive = e.is_active;

        if (reviewingDateInfo) {
          if (
            currentDate > reviewingDateInfo ||
            (currentDate.toDateString() === reviewingDateInfo.toDateString() &&
              reviewingTimeInfo &&
              currentDate.toLocaleTimeString() > reviewingTimeInfo)
          ) {
            isActive = false;
            await supabase
              .from('tutorial_to_me')
              .update({is_active: false})
              .eq('exercise_id', e.exercise_id);
            return null;
          }
        }

        return {
          exerciseId: e.exercise_id,
          createdBy: e.created_by,
          replied_id: e.replied_id,
          teamId: e.team_id,
          writingDate: e.writing_date ? e.writing_date : '',
          writingTime: e.writing_time ? e.writing_time : '',
          reviewingDate: e.reviewing_date ? e.reviewing_date : '',
          reviewingTime: e.reviewing_time ? e.reviewing_time : '',
          isActive: isActive,
          reviewed: e.reviewed,
          type: 'tutorial_to_me',
          answers: {
            strengths: e.strengths,
            weaknesses: e.weaknesses,
            communications: e.communications,
          },
        };
      }),
    );

    return {exercises: exercisesData.filter((e) => e !== null)};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to fetch exercises'};
  }
}

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
