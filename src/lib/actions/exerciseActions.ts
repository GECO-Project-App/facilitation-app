'use server';
import {createClient} from '../supabase/server';

export async function getExercisesData(teamId: string) {
  const supabase = createClient();

  try {
    const {data: exercises, error: exercisesError} = await supabase
      .from('tutorial_to_me')
      .select()
      .eq('team_id', teamId);

    if (exercisesError) throw exercisesError;

    const exercisesData = exercises.map((e) => ({
      exerciseId: e.exercise_id,
      createdBy: e.created_by,
      teamId: e.team_id,
      writingDate: e.writing_date ? e.writing_date : undefined,
      reviewingDate: e.reviewing_date ? e.reviewing_date : undefined,
      type: 'tutorial_to_me',
    }));
    return {exercises: exercisesData};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to fetch exercises'};
  }
}
