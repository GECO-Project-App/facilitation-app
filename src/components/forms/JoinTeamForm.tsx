'use client';
import {useToast} from '@/hooks/useToast';
import {joinTeamByCode} from '@/lib/actions/teamActions';
import {joinTeamSchema, JoinTeamSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const JoinTeamForm = () => {
  const {toast} = useToast();
  const t = useTranslations('team');

  const form = useForm<JoinTeamSchema>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: JoinTeamSchema) => {
    const result = await joinTeamByCode(data.code);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        variant: 'default',
        title: t('toast.joined'),
      });
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-center text-base font-semibold">{t('tabs.join')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 min-h-[400px]">
          <FormField
            control={form.control}
            name="code"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input type="text" {...field} placeholder={t('tabs.code')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="white"
            size="default"
            className="mx-auto">
            {form.formState.isSubmitting ? '...' : t('tabs.button')}
          </Button>
        </form>
      </Form>
    </section>
  );
};
