'use client';
import {Switch} from '@/components/ui/switch';
import {useToast} from '@/hooks/useToast';
import {useNotification} from '@/lib/providers/notifications/useNotification';
import {createClient} from '@/lib/supabase/client';
import {NotificationPreferences} from '@/lib/types';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {requestNotificationPermission} from '@/lib/providers/notifications/NotificationPush';
export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const {toast} = useToast();
  const t = useTranslations('settings.notifications');
  const supabase = createClient();
  const {user} = useUserStore();
  const {isSupported, isSubscribed, handleSubscribe, handleUnsubscribe} = useNotification();
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      const {data: profile} = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();

      if (profile?.notification_preferences) {
        setPreferences(profile.notification_preferences as NotificationPreferences);
      }
    };

    loadPreferences();
  }, [supabase, user]);

  // Sync preferences with subscription status - with debounce to prevent multiple calls
  useEffect(() => {
    // Skip if no preferences or user
    if (!preferences || !user) return;

    // Use a flag to track if we're currently processing a subscription change
    let isProcessing = false;

    const syncSubscriptionStatus = async () => {
      // Prevent multiple calls
      if (isProcessing) return;
      isProcessing = true;

      try {
        // If user has preferences but subscription status doesn't match
        if (preferences.push_enabled && !isSubscribed) {
          // Only prompt to subscribe if they have enabled notifications in preferences
          // and we're not already subscribed
          await handleSubscribe();
        } else if (!preferences.push_enabled && isSubscribed) {
          // If they've disabled notifications in preferences but are still subscribed
          await handleUnsubscribe();
        }
      } catch (error) {
        console.error('Error syncing subscription status:', error);
      } finally {
        isProcessing = false;
      }
    };

    // Use a timeout to debounce multiple rapid changes
    const timeoutId = setTimeout(syncSubscriptionStatus, 500);

    // Clean up timeout
    return () => clearTimeout(timeoutId);
  }, [preferences?.push_enabled, isSubscribed, user]);

  const updatePreferences = async (
    pushEnabled?: boolean,
    notificationSettings?: Partial<NotificationPreferences['notifications']>,
  ) => {
    try {
      // Handle push subscription/unsubscription when toggling the main switch
      if (pushEnabled !== undefined) {
        if (pushEnabled) {
          // First request notification permission from the browser
          if (Notification.permission !== 'granted') {
            try {
              const permission = await requestNotificationPermission();
              if (permission !== 'granted') {
                // User denied permission, update UI accordingly
                toast({
                  variant: 'destructive',
                  title: t('permissionDenied'),
                  description: t('permissionDeniedDescription'),
                });
                // Don't update preferences if permission was denied
                return;
              }
            } catch (error) {
              console.error('Error requesting notification permission:', error);
              toast({
                variant: 'destructive',
                title: t('permissionError'),
                description: t('permissionErrorDescription'),
              });
              return;
            }
          }

          // User granted permission, subscribe them
          // Note: We'll let the sync effect handle the subscription to avoid duplicate calls
        } else if (isSubscribed) {
          // User is disabling notifications, unsubscribe them
          // We'll handle this in the database update first, then let the sync effect
          // handle the actual unsubscription to avoid duplicate calls
        }
      }

      // Update preferences in database
      const {data, error} = await supabase.rpc('update_notification_preferences', {
        p_push_enabled: pushEnabled,
        p_notification_settings: notificationSettings,
      });

      if (error) throw error;

      // Update local state
      setPreferences(data as NotificationPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        variant: 'destructive',
        title: t('updateError'),
      });
    }
  };

  if (!preferences || !user || !isSupported) return null;

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold">{t('pushNotifications')}</h2>
            <p className="text-sm text-gray-500">{t('pushDescription')}</p>
          </div>
          <Switch
            checked={preferences.push_enabled && isSubscribed}
            onCheckedChange={(checked) => updatePreferences(checked)}
          />
        </div>

        <div className="space-y-4 pl-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('teamInvitations')}</label>
            <Switch
              checked={preferences.notifications.team_invitation && isSubscribed}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {team_invitation: checked})
              }
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('statusChanges')}</label>
            <Switch
              checked={preferences.notifications.exercise_status_change && isSubscribed}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {exercise_status_change: checked})
              }
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('newExercises')}</label>
            <Switch
              checked={preferences.notifications.new_exercise && isSubscribed}
              onCheckedChange={(checked) => updatePreferences(undefined, {new_exercise: checked})}
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('deadlines')}</label>
            <Switch
              checked={preferences.notifications.upcoming_deadline && isSubscribed}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {upcoming_deadline: checked})
              }
              disabled={!preferences.push_enabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
