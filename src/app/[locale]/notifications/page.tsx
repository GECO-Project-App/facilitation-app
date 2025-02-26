'use client';
import {NotificationSubscriptionForm} from '@/components/NotificationSubscriptionForm';
import NotificationSubscriptionStatus from '@/components/NotificationSubscriptionStatus';
import {UnsupportedNotificationMessage} from '@/components/UnsupportedNotificationMessage';
import {useNotification} from '@/lib/providers/notifications/useNotification';
import {useTranslations} from 'next-intl';

export default function NotificationsPage() {
  const {isSupported, isSubscribed} = useNotification();
  const t = useTranslations('notifications');

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('manage')}</h2>
          <p className="mb-6">{t('description')}</p>

          {!isSupported ? <UnsupportedNotificationMessage /> : <NotificationSubscriptionStatus />}
        </div>

        {isSubscribed && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{t('testNotification')}</h2>
            <p className="mb-6">{t('testDescription')}</p>
            <NotificationSubscriptionForm />
          </div>
        )}
      </div>
    </div>
  );
}
