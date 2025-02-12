'use client';
import {useToast} from '@/hooks/useToast';
import {sendResetPasswordEmail} from '@/lib/actions/authActions';
import {resetPasswordSchema, ResetPasswordSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {RefreshCcw} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const ResetPasswordForm = () => {
  const {toast} = useToast();
  const t = useTranslations();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    const result = await sendResetPasswordEmail(data.email);

    if (result.error) {
      toast({
        title: result.error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        duration: 4000,
        title: t('authenticate.updatePassword.emailSent'),
        description: t('authenticate.updatePassword.emailSentDescription'),
        variant: 'success',
      });
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
                <Input type="email" {...field} placeholder={t('authenticate.enterEmail')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-14 flex justify-center pb-6">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t('authenticate.loading') : t('authenticate.reset')}{' '}
            <RefreshCcw />
          </Button>
        </div>
      </form>
    </Form>
  );
};
