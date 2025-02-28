'use client';
import {Switch} from '@/components/ui/switch';
import {useToast} from '@/hooks/useToast';
import {createClient} from '@/lib/supabase/client';
import {EmailPreferences} from '@/lib/types';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

export const EmailSettings = () => {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const {toast} = useToast();
  const t = useTranslations('settings.emails');
  const supabase = createClient();
  const {user} = useUserStore();

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      const {data: profile} = await supabase
        .from('profiles')
        .select('email_preferences')
        .eq('id', user.id)
        .single();

      if (profile?.email_preferences) {
        setPreferences(profile.email_preferences as EmailPreferences);
      }
    };

    loadPreferences();
  }, [supabase, user]);

  const updatePreferences = async (
    emailEnabled?: boolean,
    notificationSettings?: Partial<EmailPreferences['notifications']>,
  ) => {
    try {
      // Update preferences in database
      const {data, error} = await supabase.rpc('update_email_preferences', {
        p_email_enabled: emailEnabled,
        p_notification_settings: notificationSettings,
      });

      if (error) throw error;

      // Update local state
      setPreferences(data as EmailPreferences);

      toast({
        variant: 'success',
        title: t('updateSuccess'),
      });
    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast({
        variant: 'destructive',
        title: t('updateError'),
      });
    }
  };

  if (!preferences || !user) return null;

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold">{t('emailNotifications')}</h2>
            <p className="text-sm text-gray-500">{t('emailDescription')}</p>
          </div>
          <Switch
            checked={preferences.email_enabled}
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
              disabled={!preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('statusChanges')}</label>
            <Switch
              checked={preferences.notifications.exercise_status_change}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {exercise_status_change: checked})
              }
              disabled={!preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('newExercises')}</label>
            <Switch
              checked={preferences.notifications.new_exercise}
              onCheckedChange={(checked) => updatePreferences(undefined, {new_exercise: checked})}
              disabled={!preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('deadlines')}</label>
            <Switch
              checked={preferences.notifications.upcoming_deadline}
              onCheckedChange={(checked) =>
                updatePreferences(undefined, {upcoming_deadline: checked})
              }
              disabled={!preferences.email_enabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
