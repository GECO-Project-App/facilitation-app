'use server';

type ExerciseAnswerType = {
  exercise_id: string;
  replied_id: string;
  s1: string;
  s2: string;
  s3: string;
  w1: string;
  w2: string;
  w3: string;
  c1: string;
  c2: string;
  c3: string;
};

function arrayToString(arr: string[]): string {
  return arr.join(', ');
}

export async function saveTutorialToMeAnswer(answerExerciseData: ExerciseAnswerType) {
  const strengths = [answerExerciseData.s1, answerExerciseData.s2, answerExerciseData.s3];
  const weaknesses = [answerExerciseData.w1, answerExerciseData.w2, answerExerciseData.w3];
  const challenges = [answerExerciseData.c1, answerExerciseData.c2, answerExerciseData.c3];
  const saveData = {
    exercise_id: answerExerciseData.exercise_id,
    replied_id: answerExerciseData.replied_id,
    strengths: arrayToString(strengths),
    weaknesses: arrayToString(weaknesses),
    challenges: arrayToString(challenges),
  };
  console.log('-----saveData--------->', saveData);
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
