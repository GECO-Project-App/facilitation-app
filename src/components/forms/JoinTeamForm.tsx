'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {joinTeamByCode} from '@/lib/actions/teamActions';
import {teamCodeSchema, TeamCodeSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {TeamToast} from '../icons';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const JoinTeamForm = () => {
  const {toast} = useToast();
  const t = useTranslations('team');
  const router = useRouter();
  const form = useForm<TeamCodeSchema>({
    resolver: zodResolver(teamCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: TeamCodeSchema) => {
    const result = await joinTeamByCode(data.code);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        variant: 'transparent',
        size: 'fullscreen',
        className: 'text-black bg-white',
        duration: 2000,
        children: (
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <h3 className="text-lg font-semibold">{t('toast.joined')}</h3>
            <TeamToast />
          </div>
        ),
      });
    }
    if (result?.teamId) {
      router.push(`/team?teamId=${result.teamId}`);
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
