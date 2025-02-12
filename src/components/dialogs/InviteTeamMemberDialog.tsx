'use client';
import {useToast} from '@/hooks/useToast';
import {inviteTeamMember} from '@/lib/actions/emailActions';
import {InviteTeamMemberSchema, inviteTeamMemberSchema} from '@/lib/zodSchemas';
import {useTeamStore} from '@/store/teamStore';
import {zodResolver} from '@hookform/resolvers/zod';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {Rocket} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {InviteTeam} from '../icons';
import {Button} from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {Form, FormControl, FormField, FormItem, FormMessage} from '../ui/form';
import {Input} from '../ui/input';

export const InviteTeamMemberDialog = () => {
  const {currentTeam, isFacilitator} = useTeamStore();
  const {toast} = useToast();
  const t = useTranslations('team');
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');
  const [open, setOpen] = useState(false);

  const form = useForm<InviteTeamMemberSchema>({
    resolver: zodResolver(inviteTeamMemberSchema),
    defaultValues: {email: '', teamId: teamId ?? undefined},
  });

  if (!currentTeam) return null;

  const onSubmit = async (data: InviteTeamMemberSchema) => {
    const {error} = await inviteTeamMember({...data, teamId: currentTeam.id});
    if (error) {
      toast({
        title: t('page.inviteTeam.error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({description: t('page.inviteTeam.success'), variant: 'success'});
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="white" size="xs" className="justify-between w-full">
          {t('page.inviteTeam.title')} <InviteTeam />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-green ">
        <DialogHeader>
          <DialogTitle>{t('page.inviteTeam.email')}</DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>{t('page.inviteTeam.title')}</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full flex flex-col justify-center items-center">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder={t('page.inviteTeam.label')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="small" variant="white">
              {t('page.inviteTeam.button')} <Rocket />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
