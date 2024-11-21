'use server';
import {revalidatePath} from 'next/cache';
import {createClient} from '../supabase/server';
import {profileSchema, ProfileSchema} from '../zodSchemas';

export async function updateProfile(data: ProfileSchema) {
  const supabase = createClient();

  try {
    const validatedFields = profileSchema.parse(data);

    const {data: user, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;

    // Update auth metadata
    const {error: updateAuthError} = await supabase.auth.updateUser({
      data: {
        first_name: validatedFields.first_name,
        last_name: validatedFields.last_name,
      },
    });

    if (updateAuthError) throw updateAuthError;

    // Update profile
    const {error: updateProfileError} = await supabase
      .from('profiles')
      .update({
        first_name: validatedFields.first_name,
        last_name: validatedFields.last_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.user.id);

    if (updateProfileError) throw updateProfileError;

    revalidatePath('/settings', 'page');
    return {success: true, user: user.user};
  } catch (error) {
    console.error('Profile update error:', error);
    return {error: 'Failed to update profile'};
  }
}
