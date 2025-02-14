'use client';
import {useToast} from '@/hooks/useToast';
import {Link, useRouter} from '@/i18n/routing';
import {login} from '@/lib/actions/authActions';
import {LoginSchema, loginSchema} from '@/lib/zodSchemas';
import {useTeamStore} from '@/store/teamStore';
import {useUserStore} from '@/store/userStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const LoginForm = () => {
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const setUser = useUserStore((state) => state.setUser);
  const {init} = useTeamStore();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result?.session) {
      setUser(result.session.user);
      init();
      toast({
        variant: 'success',
        title: t('loggedIn'),
      });
      router.push('/activities');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 h-full md:min-h-[400px]">
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

        <Link
          href="/settings/reset-password"
          className="text-green hover:underline text-sm text-center">
          {t('forgotPassword')}
        </Link>
        <div className="mt-10 flex justify-center pb-6">
          <Button type="submit" disabled={form.formState.isSubmitting} variant="green">
            {form.formState.isSubmitting ? t('loading') : t('logIn')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
