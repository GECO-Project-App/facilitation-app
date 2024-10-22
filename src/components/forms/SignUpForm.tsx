'use client';

import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {signup} from '@/lib/actions';
import {SignupSchema, signupSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const SignUpForm = () => {
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const router = useRouter();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    const result = await signup(data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      router.replace('/user/profile');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 min-h-[448px]">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="email" {...field} placeholder={t('enterEmail')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="password" {...field} placeholder={t('enterPassword')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="password" {...field} placeholder={t('confirmPassword')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} placeholder={t('firstName')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} placeholder={t('lastName')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-14 flex justify-center pb-6">
          <Button type="submit" disabled={form.formState.isSubmitting} variant="green">
            {form.formState.isSubmitting ? t('loading') : t('signUp')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
