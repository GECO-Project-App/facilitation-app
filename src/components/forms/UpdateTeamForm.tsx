'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {deleteTeam, updateTeam} from '@/lib/actions/teamActions';
import {UpdateTeamSchema, updateTeamSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {Trash} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Tables} from '../../../database.types';
import {TeamActionAlert} from '../TeamActionAlert';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '../ui';
import {Checkbox} from '../ui/checkbox';

type TeamWithMembers = Tables<'teams'> & {
  team_members: Array<Omit<Tables<'team_members'>, 'joined_at' | 'team_id'>>;
};

export const UpdateTeamForm = ({
  currentTeam,
}: {
  currentTeam: Omit<TeamWithMembers, 'created_at'> | null;
}) => {
  const {toast} = useToast();
  const t = useTranslations('team');
  const router = useRouter();

  const form = useForm<UpdateTeamSchema>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: currentTeam?.name ?? '',
      delete: false,
    },
  });

  const onSubmit = async (data: UpdateTeamSchema) => {
    if (!currentTeam) return;

    const result = await updateTeam(data, currentTeam.id);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: t('edit.toast.error'),
      });
    } else {
      toast({
        duration: 2000,
        variant: 'success',
        title: t('edit.toast.success'),
      });
    }
    router.push(`/team`);
  };

  return (
    <section className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('tabs.name')}</FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder={t('tabs.name')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delete"
            render={({field}) => (
              <FormItem className="flex flex-row items-start gap-4 space-y-0 rounded-xl border border-red p-4 bg-red/10">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-2 leading-none flex-1">
                  <FormLabel className="text-red">{t('edit.deletionTitle')}</FormLabel>
                  <FormDescription className="text-red/70">
                    {t('edit.deletionDescription')}
                  </FormDescription>
                </div>
                <TeamActionAlert
                  onAction={async () => {
                    if (currentTeam?.id && form.getValues('delete')) {
                      await deleteTeam(currentTeam.id);
                    } else {
                      toast({
                        duration: 4000,
                        variant: 'destructive',
                        title: t('edit.delete.deleteError'),
                        description: t('edit.delete.deletedErrorDescription'),
                      });
                    }
                  }}
                  title={t('edit.delete.title', {name: currentTeam?.name})}
                  description={t('edit.delete.description')}>
                  <Button variant="red" size="xs" className=" aspect-square">
                    <Trash />
                  </Button>
                </TeamActionAlert>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="pink"
            size="default"
            className="mx-auto">
            {form.formState.isSubmitting ? '...' : t('tabs.save')}
          </Button>
        </form>
      </Form>
    </section>
  );
};
