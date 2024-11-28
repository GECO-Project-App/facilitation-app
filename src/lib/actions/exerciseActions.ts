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
      replied_id: e.replied_id,
      teamId: e.team_id,
      writingDate: e.writing_date ? e.writing_date : '',
      writingTime: e.writing_time ? e.writing_time : '',
      reviewingDate: e.reviewing_date ? e.reviewing_date : '',
      reviewingTime: e.reviewing_time ? e.reviewing_time : '',
      isActive: e.is_active,
      reviewed: e.reviewed,
      type: 'tutorial_to_me',
      answers: {
        strengths: e.strengths,
        weaknesses: e.weaknesses,
        communications: e.communications,
      },
    }));

    return {exercises: exercisesData};
  } catch (error) {
    console.log('Unexpected error:', error);
    return {error: 'Failed to fetch exercises'};
  }
}

// export async function getExercisesAnswersData(exerciseId: string) {
//   const supabase = createClient();

//   try {
//     const {data: answerData, error: answerDataError} = await supabase
//       .from('tutorial_to_me')
//       .select()
//       .eq('answer_exercise_id', exerciseId);

//     if (answerDataError) throw answerDataError;

//     const answersData = answerData.map((e) => ({
//       exerciseId: e.answer_exercise_id,
//       replied_id: e.replied_id,
//       strengths: e.strengths,
//       weaknesses: e.weaknesses,
//       communications: e.communications,
//     }));
//     return {answers: answersData};
//   } catch (error) {
//     console.log('Unexpected error:', error);
//     return {error: 'Failed to fetch exercises'};
//   }
// }
