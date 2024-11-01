'use server';
import {createClient} from '../supabase/server';

type TutorialToMeType = {
  created_by: string;
  writing_date: string;
  reviewing_date: string;
  members: string;
};
export async function createTutorialToMe(tutorialData: TutorialToMeType) {
  const supabase = createClient();
  try {
    const {data, error} = await supabase.from('tutorial_to_me').insert([tutorialData]).select();

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
