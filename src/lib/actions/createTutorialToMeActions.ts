'use server';
import {createClient} from '../supabase/server';
import {tutorialToMeSchema, TutorialToMeSchema} from '../zodSchemas';

export async function createTutorialToMe(tutorialData: TutorialToMeSchema) {
  const supabase = createClient();

  try {
    const validatedFields = tutorialToMeSchema.parse(tutorialData);
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const {data: teamData, error: teamError} = await supabase
      .from('teams')
      .select('id')
      .eq('id', validatedFields.team_id)
      .maybeSingle();

    if (teamError || !teamData) {
      console.error('Error fetching team data:', teamError);
      return {error: teamError?.message || 'Failed to fetch team data'};
    }

    const {data: newTutorialToMe, error: tutorialToMeError} = await supabase
      .from('tutorial_to_me')
      .insert({
        replied_id: user.user.id,
        created_by: user.user.id,
        team_id: teamData.id,
        writing_date: validatedFields.writing_date,
        writing_time: validatedFields.writing_time,
        reviewing_date: validatedFields.reviewing_date,
        reviewing_time: validatedFields.reviewing_time,
        strengths: validatedFields.strengths,
        weaknesses: validatedFields.weaknesses,
        communications: validatedFields.communications,
      })
      .select();

    if (tutorialToMeError) {
      console.error('Error inserting data:', tutorialToMeError);
      return {error: tutorialToMeError.message};
    }

    console.log('Data inserted successfully:', newTutorialToMe);
    return {success: true, data: newTutorialToMe};
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

export async function updateReviewAndActiveTutorialToMe(exerciseId: string) {
  const supabase = createClient();
  const {data: userData, error: userDataError} = await supabase.auth.getUser();
  if (userDataError) throw userDataError;
  const {error: updateReviewError} = await supabase
    .from('tutorial_to_me')
    .update({reviewed: true})
    .eq('exercise_id', exerciseId)
    .eq('replied_id', userData.user.id);

  if (updateReviewError) {
    console.error('Error updating review:', updateReviewError);
    return {error: updateReviewError.message};
  }

  return {success: true};
}
