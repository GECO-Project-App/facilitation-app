'use server';

type ExerciseAnswerType = {
  strengths: string[];
  weaknesses: string[];
  communications: string[];
  exercise_id: string;
};

function arrayToString(arr: string[]): string {
  return arr.join(', ');
}

export async function saveTutorialToMeAnswer(answerExerciseData: ExerciseAnswerType) {
  const saveData = {
    strengths: arrayToString(answerExerciseData.strengths),
    weaknesses: arrayToString(answerExerciseData.weaknesses),
    challenges: arrayToString(answerExerciseData.communications),
    exercise_id: answerExerciseData.exercise_id,
  };
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
