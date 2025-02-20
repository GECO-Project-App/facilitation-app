'use client';
import {NotificationSubscriptionForm} from '@/components/NotificationSubscriptionForm';
import NotificationSubscriptionStatus from '@/components/NotificationSubscriptionStatus';
import {UnsupportedNotificationMessage} from '@/components/UnsupportedNotificationMessage';
import {useNotification} from '@/lib/providers/notifications/useNotification';

const Test = () => {
  const {isSupported, isSubscribed} = useNotification();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh)] bg-gray-100 p-4">
      {!isSupported ? <UnsupportedNotificationMessage /> : <NotificationSubscriptionStatus />}

      {isSubscribed && <NotificationSubscriptionForm />}
    </div>
  );
};

export default Test;
