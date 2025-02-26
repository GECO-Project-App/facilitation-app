'use client';
import {AlertTriangle} from 'lucide-react';
import {useTranslations} from 'next-intl';

export const UnsupportedNotificationMessage = () => {
  const t = useTranslations('notifications');

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Browser Not Supported</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your browser does not support push notifications. Please use a modern browser like
              Chrome, Firefox, Edge, or Safari to receive notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
