'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {resetPasswordForEmail} from '@/lib/actions/authActions';
import {updatePasswordSchema, UpdatePasswordSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input} from '../ui';

export const UpdatePasswordForm = () => {
  const t = useTranslations('authenticate');
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: UpdatePasswordSchema) => {
    const result = await resetPasswordForEmail(data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      router.push('/settings');
      toast({
        title: t('updatePassword.success'),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t('updatePassword.newPassword')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  autoComplete="new-password"
                  placeholder={t('enterPassword')}
                  disabled={!!error}
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
              <FormLabel>{t('updatePassword.confirmPassword')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  autoComplete="new-password"
                  placeholder={t('confirmPassword')}
                  disabled={!!error}
                />
              </FormControl>
              {error && (
                <FormMessage className="text-center">
                  {errorDescription?.replace(/\+/g, ' ')}
                </FormMessage>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || !!error} className="w-full">
          {form.formState.isSubmitting ? '...' : t('updatePassword.button')}
        </Button>
      </form>
    </Form>
  );
};
