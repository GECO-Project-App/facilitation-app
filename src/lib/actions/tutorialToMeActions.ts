'use server';
import {createClient} from '../supabase/server';

type TutorialToMeType = {
  created_by: string;
  writing_date: string;
  reviewing_date: string;
  members: string;
};

export async function createTutorialToMe(data: TutorialToMeType) {
  const supabase = createClient();
  try {
    const {data: supabaseData, error} = await supabase.from('tutorial_to_me').insert([data]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', supabaseData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
