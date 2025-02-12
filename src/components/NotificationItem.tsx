'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {acceptTeamInvitation} from '@/lib/actions/emailActions';
import {createClient} from '@/lib/supabase/client';
import {Notification, NotificationType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Check, Hourglass, Pencil, UserRoundPen, Users, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';
import {TeamToast} from './icons';
import {Button} from './ui';

export const NotificationItem = ({notification}: {notification: Notification}) => {
  const t = useTranslations();
  const {toast} = useToast();
  const router = useRouter();

  const Icon: React.ReactNode = useMemo(() => {
    switch (notification.type as NotificationType) {
      case 'new_exercise':
        return <Pencil size={24} />;
      case 'team_invitation':
        return <Users size={24} />;
      case 'exercise_status_change':
        return <UserRoundPen size={24} />;
      case 'upcoming_deadline':
        return <Hourglass size={24} />;
    }
  }, [notification.type]);

  const markAsRead = async () => {
    const supabase = createClient();
    try {
      const {data, error} = await supabase.rpc('mark_notification_read', {
        p_notification_id: notification.id,
      });

      if (data) {
        router.refresh();
      }

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const acceptInvitation = async () => {
    const inviteResult = await acceptTeamInvitation(notification.data.invitation_id);

    if (inviteResult?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: inviteResult.error,
      });
    } else {
      markAsRead();
      toast({
        variant: 'transparent',
        size: 'fullscreen',
        className: 'text-black bg-white',
        duration: 2000,
        children: (
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <h3 className="text-lg font-semibold">{t('team.toast.joined')}</h3>
            <TeamToast />
          </div>
        ),
      });
      router.push(`/team?teamId=${inviteResult.teamId}`);
    }
  };

  return (
    <div
      className={cn(
        'border-2 border-black rounded-4xl bg-white p-6 shadow-dark flex flex-col gap-4',
        !notification.is_read && notification.type !== 'team_invitation' && 'cursor-pointer ',
        notification.is_read && 'opacity-75',
      )}
      onClick={
        !notification.is_read && notification.type !== 'team_invitation' ? markAsRead : undefined
      }>
      <div className="flex flex-row items-center gap-4 ">
        {Icon}
        <p className={cn(notification.is_read && 'line-through')}>
          {t(`notifications.type.${notification.type}`, {
            teamName: notification.data.team_name,
            user: notification.data.inviter_name,
          })}
        </p>
      </div>
      {notification.type === 'team_invitation' && notification.is_read === false && (
        <div className="flex  flex-row justify-between">
          <Button
            variant="red"
            className="rounded-full aspect-square"
            size="xs"
            onClick={markAsRead}>
            <X />
          </Button>
          <Button
            variant="green"
            className="rounded-full aspect-square"
            size="xs"
            onClick={acceptInvitation}>
            <Check />
          </Button>
        </div>
      )}
    </div>
  );
};
