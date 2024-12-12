'use server';
import {createClient} from '../supabase/server';

type ExerciseAnswerType = {
  strengths: string;
  weaknesses: string;
  communications: string;
  exercise_id: string;
  team_id: string;
  created_by: string;
  reviewing_date?: string;
  reviewing_time?: string;
};

// function arrayToString(arr: string[]): string {
//   return arr.join(', ');
// }

export async function saveTutorialToMeAnswer(answerExerciseData: ExerciseAnswerType) {
  const supabase = createClient();
  try {
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const {data: existingData, error: fetchError} = await supabase
      .from('tutorial_to_me')
      .select('exercise_id, replied_id')
      .eq('exercise_id', answerExerciseData.exercise_id)
      .eq('replied_id', user.user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const saveData = {
      strengths: answerExerciseData.strengths,
      weaknesses: answerExerciseData.weaknesses,
      communications: answerExerciseData.communications,
      exercise_id: answerExerciseData.exercise_id,
      replied_id: user.user.id,
      team_id: answerExerciseData.team_id,
      created_by: answerExerciseData.created_by,
      reviewing_date: answerExerciseData.reviewing_date ? answerExerciseData.reviewing_date : '',
      reviewing_time: answerExerciseData.reviewing_time ? answerExerciseData.reviewing_time : '',
    };

    let result;
    if (existingData) {
      const {data, error} = await supabase
        .from('tutorial_to_me')
        .update({
          strengths: saveData.strengths,
          weaknesses: saveData.weaknesses,
          communications: saveData.communications,
        })
        .eq('exercise_id', answerExerciseData.exercise_id)
        .eq('replied_id', user.user.id)
        .select();
      if (error) throw error;
      result = data;
    } else {
      const {data, error} = await supabase.from('tutorial_to_me').insert([saveData]).select();
      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
