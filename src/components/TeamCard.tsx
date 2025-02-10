'use client';
import {useToast} from '@/hooks/useToast';
import {Link, useRouter} from '@/i18n/routing';
import {joinTeamByCode} from '@/lib/actions/teamActions';
import {teamCodeSchema, TeamCodeSchema} from '@/lib/zodSchemas';
import {useTeamStore} from '@/store/teamStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {Rocket} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {InviteTeamMemberDialog} from './dialogs/InviteTeamMemberDialog';
import {EditTeam, TeamToast} from './icons';
import {TeamAvatars} from './TeamAvatars';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from './ui';

export const TeamCard = () => {
  const {currentTeam, isFacilitator, updateUserTeams} = useTeamStore();
  const {toast} = useToast();
  const router = useRouter();
  const t = useTranslations('team');

  const form = useForm({
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
      updateUserTeams();
      router.refresh();
    }
  };

  return (
    <div className="max-w-xs mx-auto">
      {currentTeam ? (
        <div className="bg-yellow  rounded-3xl border-2 border-black p-4 flex flex-col gap-4 h-full">
          <TeamAvatars />
          <InviteTeamMemberDialog />
          {isFacilitator && (
            <Link href={`/team?teamId=${currentTeam.id}`}>
              <Button variant="white" size="xs" className=" justify-between w-full">
                {t('teamCard.edit')}
                <EditTeam />
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-green rounded-3xl border-2 border-black p-4  flex flex-col gap-4 h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-center text-base font-semibold">
                  {t.rich('teamCard.noTeam', {br: () => <br />})}
                </p>
              </div>
              <FormField
                control={form.control}
                name="code"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder={t('teamCard.enterCode')}
                        className="px-4 py-2 text-sm font-normal "
                        autoComplete="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant="white"
                size="xs"
                className="mx-auto">
                {form.formState.isSubmitting ? '...' : t('teamCard.ready')}
                <Rocket size={20} />
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
