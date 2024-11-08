'use server';
import {createClient} from '../supabase/server';

type ExerciseAnswerType = {
  strengths: string[];
  weaknesses: string[];
  communications: string[];
  exercise_id: string;
  team_id: string;
  created_by: string;
};

function arrayToString(arr: string[]): string {
  return arr.join(', ');
}

export async function saveTutorialToMeAnswer(answerExerciseData: ExerciseAnswerType) {
  const supabase = createClient();

  try {
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const saveData = {
      strengths: arrayToString(answerExerciseData.strengths),
      weaknesses: arrayToString(answerExerciseData.weaknesses),
      communications: arrayToString(answerExerciseData.communications),
      exercise_id: answerExerciseData.exercise_id,
      replied_id: user.user.id,
      team_id: answerExerciseData.team_id,
      created_by: answerExerciseData.created_by,
    };
    const {data, error} = await supabase.from('tutorial_to_me').insert([saveData]).select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
  }

  //   const supabase = createClient();
  //   try {
  //     const {data, error} = await supabase.from('tutorial_to_me').insert([answerExerciseData]).select();

  //     if (error) {
  //       console.error('Error inserting data:', error);
  //     } else {
  //       console.log('Data inserted successfully:', data);
  //       console.log('supabaseData:', data);
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error('Unexpected error:', error);
  //   }
}
