'use client';

import {useToast} from '@/hooks/useToast';
import {signup} from '@/lib/actions/authActions';
import {acceptTeamInvitation} from '@/lib/actions/emailActions';
import {SignupSchema, signupSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

interface SignUpFormProps {
  defaultEmail?: string | null;
  invitationId?: string | null;
}

export const SignUpForm = ({defaultEmail, invitationId}: SignUpFormProps) => {
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const router = useRouter();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: defaultEmail || '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    const result = await signup(data);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.error,
      });
    } else if (result?.user) {
      if (invitationId) {
        // Handle team invitation
        const inviteResult = await acceptTeamInvitation(invitationId);
        if (inviteResult.error) {
          toast({
            variant: 'destructive',
            title: inviteResult.error,
          });
        }
        router.refresh();
      } else {
        router.refresh();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 h-full">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="email" {...field} placeholder={t('enterEmail')} autoComplete="email" />
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
                <Input
                  type="password"
                  {...field}
                  placeholder={t('enterPassword')}
                  autoComplete="false"
                />
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
                <Input
                  type="password"
                  {...field}
                  placeholder={t('confirmPassword')}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder={t('firstName')}
                  autoComplete="given-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder={t('lastName')}
                  autoComplete="family-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-8 flex justify-center pb-6">
          <Button type="submit" disabled={form.formState.isSubmitting} variant="green">
            {form.formState.isSubmitting ? t('loading') : t('signUp')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
