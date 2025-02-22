'use client';

import {Link} from '@/i18n/routing';
import {useNotification} from '@/lib/providers/notifications/useNotification';
import {createClient} from '@/lib/supabase/client';
import {NotificationPreferences} from '@/lib/types';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {GecoEnvelop} from './icons/geco-envelop';

export const PushNotificationBanner = () => {
  const t = useTranslations('activities.notificationBanner');
  const {user} = useUserStore();
  const supabase = createClient();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const {subscription, isSupported} = useNotification();

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      const {data: profile} = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();

      if (profile?.notification_preferences) {
        setPreferences(profile?.notification_preferences as NotificationPreferences);
      }
    };

    loadPreferences();
  }, [supabase, user]);

  if (subscription || !isSupported || preferences?.push_enabled) {
    return null;
  }
  return (
    <Link href="/settings">
      <div className="relative rounded-4xl border-2 border-black bg-orange p-6 min-h-44 justify-end flex flex-row items-end">
        <GecoEnvelop className="absolute top-1/2 -translate-y-1/2 -left-8" />
        <div className="flex flex-col gap-2 w-[50%] justify-end items-end ">
          <h3 className=" font-bold">{t('title')}</h3>
          <p className="text-xs">{t('description')}</p>
        </div>
      </div>
    </Link>
  );
};
