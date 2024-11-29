'use client';
import {useToast} from '@/hooks/useToast';
import {useTeamStore} from '@/store/teamStore';
import {zodResolver} from '@hookform/resolvers/zod';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {Rocket} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
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

const inviteSchema = z.object({
  email: z.string().email(),
});

export function InviteTeamMemberDialog() {
  const {currentTeam, isFacilitator} = useTeamStore();
  const {toast} = useToast();
  const t = useTranslations('team');

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {email: ''},
  });

  if (!currentTeam || !isFacilitator) return null;

  const onSubmit = async (data: z.infer<typeof inviteSchema>) => {
    console.log(data);
  };

  return (
    <Dialog>
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
}
