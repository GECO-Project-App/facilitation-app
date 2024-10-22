'use server';

import {createClient} from '@/lib/supabase/server';
import {getTranslations} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {
  loginSchema,
  LoginSchema,
  SignupSchema,
  updatePasswordSchema,
  UpdatePasswordSchema,
} from './zodSchemas';

export async function login(data: LoginSchema) {
  const supabase = createClient();
  const t = await getTranslations('authenticate');

  try {
    const validatedFields = loginSchema.parse(data);

    const {
      error,
      data: {user},
    } = await supabase.auth.signInWithPassword(validatedFields);

    if (error) {
      return {error: error.message};
    }

    revalidatePath('/user/profile ', 'page');

    return {success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorDescription')};
  }
}

export async function signup(data: SignupSchema) {
  const supabase = createClient();
  const t = await getTranslations('authenticate');

  try {
    const validatedFields = loginSchema.parse(data);

    const {
      error,
      data: {user},
    } = await supabase.auth.signUp(validatedFields);

    if (error) {
      return {error: error.message};
    }

    revalidatePath('/user/profile', 'page');

    return {success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorDescription')};
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const {error} = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_URL}/user/update-password`,
  });
}

export async function logOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function resetPasswordForEmail(data: UpdatePasswordSchema) {
  const supabase = createClient();
  const t = await getTranslations('authenticate');
  try {
    const validatedFields = updatePasswordSchema.parse(data);

    const {
      data: {user},
      error: AuthError,
    } = await supabase.auth.getUser();

    if (AuthError || !user) {
      return {error: 'No user found'};
    }

    const {error} = await supabase.auth.updateUser({
      password: validatedFields.password,
    });

    if (error) {
      return {error: error.message};
    }

    revalidatePath('/');
    return {success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorDescription')};
  }
}
