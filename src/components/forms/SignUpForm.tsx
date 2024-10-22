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

    // <form className="flex min-h-[448px] h-fit flex-col justify-between">
    //   <div className="space-y-4 px-4">
    //     <div className="space-y-2">
    //       <Input
    //         id="signup-email"
    //         name="email"
    //         type="email"
    //         placeholder={t('enterEmail')}
    //         required
    //         className="h-12 rounded-full"
    //       />
    //     </div>
    //     <div className="space-y-2">
    //       <Input
    //         id="signup-password"
    //         name="password"
    //         type="password"
    //         autoComplete="new-password"
    //         placeholder={t('enterPassword')}
    //         required
    //         className="h-12 rounded-full"
    //       />
    //     </div>
    //     <div className="space-y-2">
    //       <Input
    //         id="signup-confirm-password"
    //         name="confirmPassword"
    //         autoComplete="new-password"
    //         type="password"
    //         placeholder={t('confirmPassword')}
    //         required
    //         className="h-12 rounded-full"
    //       />
    //     </div>
    //     <div className="space-y-2">
    //       <Input
    //         id="first-name"
    //         name="firstName"
    //         type="text"
    //         placeholder={t('firstName')}
    //         className="h-12 rounded-full"
    //       />
    //     </div>
    //     <div className="space-y-2">
    //       <Input
    //         id="last-name"
    //         name="lastName"
    //         type="text"
    //         placeholder={t('lastName')}
    //         className="h-12 rounded-full"
    //       />
    //     </div>
    //   </div>
    //   <div className="mt-14 flex justify-center pb-6">
    //     <Button type="submit" disabled={pending} formAction={signup}>
    //       {pending ? t('loading') : t('signUp')}
    //     </Button>
    //   </div>
    // </form>
  );
};
