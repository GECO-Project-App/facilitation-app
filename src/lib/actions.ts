'use server';

import {createClient} from '@/lib/supabase/server';
import {getTranslations} from 'next-intl/server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {
  loginSchema,
  LoginSchema,
  resetPasswordSchema,
  ResetPasswordSchema,
  signupSchema,
  SignupSchema,
  updatePasswordSchema,
  UpdatePasswordSchema,
} from './zodSchemas';

export async function login(data: LoginSchema) {
  const supabase = createClient();
  const t = await getTranslations(['authenticate', 'error']);

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
    return {error: t('error.errorOccurred')};
  }
}

export async function signup(data: SignupSchema) {
  const supabase = createClient();
  const t = await getTranslations('authenticate');

  try {
    const validatedFields = signupSchema.parse(data);

    const {
      error,
      data: {user},
    } = await supabase.auth.signUp(validatedFields);

    if (error) {
      console.log(error);
      return {error: error.message};
    }

    revalidatePath('/user/profile', 'page');

    return {success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {error: error.errors[0].message};
    }
    return {error: t('errorOccurred')};
  }
}

export async function resetPassword(data: ResetPasswordSchema) {
  const supabase = createClient();
  const t = await getTranslations('authenticate');
  try {
    const validatedFields = resetPasswordSchema.parse(data);
    // TODO: Fix redirectTo
    const {error} = await supabase.auth.resetPasswordForEmail(validatedFields.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/user/update-password`,
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
    return {error: t('error.errorOccurred')};
  }
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
      return {error: t('error.userNotFound')};
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
    return {error: t('error.errorOccurred')};
  }
}
