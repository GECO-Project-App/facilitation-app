'use server';
import {createClient} from '../supabase/server';

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
