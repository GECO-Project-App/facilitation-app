'use client';
import {createClient} from '@/lib/supabase/client';
import {Notification} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {useEffect, useState} from 'react';

export const TabBarNotification = ({showNumber = false}: {showNumber?: boolean}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {user} = useUserStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const {data: notifications} = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', {ascending: false})
        .eq('is_read', false);

      setNotifications(notifications ?? []);
    };
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  return (
    <>
      {notifications && notifications?.length > 0 && (
        <div
          className={cn(
            'bg-red rounded-full absolute text-xs font-bold aspect-square items-center justify-center flex',
            showNumber && notifications?.length > 0
              ? ' h-5 w-5 -top-2 -right-2 '
              : ' h-3 w-3 -top-1 -right-1',
          )}>
          {showNumber && notifications
            ? notifications.length > 9
              ? '9+'
              : notifications.length
            : null}
        </div>
      )}
    </>
  );
};
