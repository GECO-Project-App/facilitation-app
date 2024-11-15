'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {createTeam} from '@/lib/actions/teamActions';
import {createTeamSchema, CreateTeamSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {TeamToast} from '../icons';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from '../ui';

export const CreateTeamForm = () => {
  const {toast} = useToast();
  const t = useTranslations('team');
  const router = useRouter();

  const form = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreateTeamSchema) => {
    const result = await createTeam(data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: t('error.title'),
        description: result.error,
      });
    } else {
      toast({
        variant: 'transparent',
        size: 'fullscreen',
        className: 'text-black bg-white',
        children: (
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <h3 className="text-lg font-semibold">{t('toast.created')}</h3>
            <TeamToast />
          </div>
        ),
      });

      router.push(`/team?id=${result.teamId}`);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-center text-base font-semibold">{t('tabs.create')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 min-h-[448px]">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input type="text" {...field} placeholder={t('tabs.name')} />
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
