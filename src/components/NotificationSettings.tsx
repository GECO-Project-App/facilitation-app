'use client';
import {Switch} from '@/components/ui/switch';
import {useToast} from '@/hooks/useToast';
import {useNotification} from '@/lib/providers/notifications/useNotification';
import {createClient} from '@/lib/supabase/client';
import {NotificationPreferences} from '@/lib/types';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const {toast} = useToast();
  const t = useTranslations('settings.notifications');
  const supabase = createClient();
  const {user} = useUserStore();
  const {isSupported} = useNotification();

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

  const updatePreferences = async (
    pushEnabled?: boolean,
    notificationSettings?: Partial<NotificationPreferences['notifications']>,
  ) => {
    try {
      const {data, error} = await supabase.rpc('update_notification_preferences', {
        p_push_enabled: pushEnabled,
        p_notification_settings: notificationSettings,
      });

      if (error) throw error;

      setPreferences(data as NotificationPreferences);
      toast({
        variant: 'success',
        title: t('updateSuccess'),
      });
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
            checked={preferences.push_enabled}
            onCheckedChange={(checked) => updatePreferences(checked)}
          />
        </div>

        <div className="space-y-4 pl-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('teamInvitations')}</label>
            <Switch
              checked={preferences.notifications.team_invitation}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {team_invitation: checked})
              }
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('statusChanges')}</label>
            <Switch
              checked={preferences.notifications.exercise_status_change}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {exercise_status_change: checked})
              }
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('newExercises')}</label>
            <Switch
              checked={preferences.notifications.new_exercise}
              onCheckedChange={(checked) => updatePreferences(undefined, {new_exercise: checked})}
              disabled={!preferences.push_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('deadlines')}</label>
            <Switch
              checked={preferences.notifications.upcoming_deadline}
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
