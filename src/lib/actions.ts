'use server';

import {createClient} from '@/lib/supabase/server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/user/profile', 'page');
  redirect('/user/profile');
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
  };

  const {error} = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/user/profile', 'page');
  redirect('/user/profile');
}

export async function logOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}
