'use server';
import {createClient} from '../supabase/server';

type TutorialToMeType = {
  team_id: string;
  writing_date: string;
  writing_time: string;
  reviewing_date: string;
  reviewing_time: string;
};
export async function createTutorialToMe(tutorialData: TutorialToMeType) {
  const supabase = createClient();
  try {
    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    const saveData = {
      ...tutorialData,
      replied_id: user.user.id,
      created_by: user.user.id,
    };

    const {data, error} = await supabase.from('tutorial_to_me').insert([saveData]).select();

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
      console.log('supabaseData:', data);
      return data;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
