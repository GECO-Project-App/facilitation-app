'use server';

import {createClient} from '@/lib/supabase/server';
import {getLocale, getTranslations} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {
  loginSchema,
  LoginSchema,
  signupSchema,
  SignupSchema,
  updatePasswordSchema,
  UpdatePasswordSchema,
} from '../zodSchemas';

export async function login(data: LoginSchema) {
  const supabase = createClient();
  const t = await getTranslations(['error']);

  try {
    const validatedFields = loginSchema.parse(data);

    const {
      error,
      data: {session},
    } = await supabase.auth.signInWithPassword(validatedFields);

    if (error) {
      return {error: error.message};
    }

    if (!session) {
      return {error: 'No session created'};
    }

    return {success: true, session};
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorOccurred')};
  }
}

export async function signup(data: SignupSchema) {
  const supabase = createClient();
  const t = await getTranslations('error');

  try {
    const validatedFields = signupSchema.parse(data);

    const {
      error,
      data: {user},
    } = await supabase.auth.signUp({
      email: validatedFields.email,
      password: validatedFields.password,
      options: {
        data: {
          first_name: validatedFields.first_name,
          last_name: validatedFields.last_name,
        },
      },
    });

    if (error) {
      return {error: error.message};
    }

    return {success: true, user};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorOccurred')};
  }
}

export const sendResetPasswordEmail = async (email: string) => {
  const supabase = createClient();
  const locale = await getLocale();

  const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_URL}/${locale}/settings/update-password`,
  });

  return {data, error};
};

export async function resetPasswordForEmail(data: UpdatePasswordSchema) {
  const supabase = createClient();
  const t = await getTranslations('error');

  try {
    const validatedFields = updatePasswordSchema.parse(data);

    const {error} = await supabase.auth.updateUser({
      password: validatedFields.password,
    });

    if (error) {
      return {error: error.message};
    }

    revalidatePath('/settings', 'page');
    return {success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorOccurred')};
  }
}
