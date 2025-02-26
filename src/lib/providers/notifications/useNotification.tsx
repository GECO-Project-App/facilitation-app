'use client';
import {useToast} from '@/hooks/useToast';
import {createClient} from '@/lib/supabase/client';
import {NotificationPreferences} from '@/lib/types';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {
  isNotificationSupported,
  isPermissionDenied,
  isPermissionGranted,
  registerAndSubscribe,
  requestNotificationPermission,
} from './NotificationPush';

// Define a type for JSON serializable data
type JsonValue = string | number | boolean | null | {[key: string]: JsonValue} | JsonValue[];

// Define a type that matches the structure of PushSubscription but can be serialized to JSON
type SerializablePushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};
type NotificationContextType = {
  isSupported: boolean;
  isSubscribed: boolean;
  isGranted: boolean;
  isDenied: boolean;
  subscription: SerializablePushSubscription | null;
  errorMessage: string | null;
  handleSubscribe: () => void;
  handleUnsubscribe: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({children}: {children: ReactNode}): JSX.Element => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [isDenied, setIsDenied] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<SerializablePushSubscription | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {user} = useUserStore();
  const {toast} = useToast();
  const supabase = createClient();
  const t = useTranslations('notifications');
  // Add subscription and unsubscription locks to prevent multiple simultaneous calls
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);

  // Convert PushSubscription to a serializable object
  const serializeSubscription = (sub: PushSubscription): SerializablePushSubscription => {
    const json = sub.toJSON();
    return {
      endpoint: json.endpoint || '',
      expirationTime: json.expirationTime || null,
      keys: {
        p256dh: json.keys?.p256dh || '',
        auth: json.keys?.auth || '',
      },
    };
  };

  // Check for existing subscription on initialization
  useEffect(() => {
    const checkExistingSubscription = async () => {
      if (isNotificationSupported()) {
        setIsSupported(true);
        const granted = isPermissionGranted();
        setIsGranted(granted);
        setIsDenied(isPermissionDenied());

        // Clean up any stale subscriptions first
        if (user) {
          await cleanupStaleSubscriptions();
        }

        if (granted) {
          try {
            // Check if there's an existing subscription in the browser
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();

            if (existingSubscription) {
              // We have an existing subscription
              const serializedSub = serializeSubscription(existingSubscription);
              setIsSubscribed(true);
              setSubscription(serializedSub);

              // If user is logged in, ensure the subscription is saved to Supabase
              if (user) {
                saveSubscriptionToSupabase(serializedSub);
              }
            } else if (user) {
              // No browser subscription but check if user has preferences enabled
              const {data: profile} = await supabase
                .from('profiles')
                .select('notification_preferences')
                .eq('id', user.id)
                .single();

              const preferences =
                profile?.notification_preferences as NotificationPreferences | null;
              if (preferences?.push_enabled) {
                // User has preferences enabled but no subscription, prompt to subscribe
                handleSubscribe();
              }
            }
          } catch (error) {
            console.error('Error checking existing subscription:', error);
          }
        }
      }
    };

    checkExistingSubscription();
  }, [user?.id]);

  // Function to clean up stale subscriptions
  const cleanupStaleSubscriptions = async () => {
    if (!user) return;

    try {
      // Get the current browser subscription if it exists
      const registration = await navigator.serviceWorker.ready;
      const currentSubscription = await registration.pushManager.getSubscription();

      if (!currentSubscription) {
        // If there's no active browser subscription, remove all database subscriptions
        console.log('No active browser subscription, cleaning up all database subscriptions');
        await supabase.from('web_push_subscriptions').delete().eq('user_id', user.id);
        return;
      }

      // Get the current subscription endpoint
      const currentEndpoint = currentSubscription.toJSON().endpoint;

      // Get all subscriptions for this user
      const {data: subscriptions} = await supabase
        .from('web_push_subscriptions')
        .select('id, subscription')
        .eq('user_id', user.id);

      if (!subscriptions || subscriptions.length === 0) {
        // No subscriptions in database, nothing to clean up
        return;
      }

      // If there are multiple subscriptions or the subscription doesn't match the current one
      // Use type assertion and safe access to handle potential null values
      const hasMatchingSubscription = subscriptions.some((sub) => {
        const subData = sub.subscription as {endpoint?: string};
        return subData?.endpoint === currentEndpoint;
      });

      if (subscriptions.length > 1 || !hasMatchingSubscription) {
        console.log(`Found ${subscriptions.length} subscriptions, cleaning up stale ones`);

        // Delete all subscriptions
        await supabase.from('web_push_subscriptions').delete().eq('user_id', user.id);

        // Re-add the current one if it exists
        if (currentSubscription) {
          const serializedSub = serializeSubscription(currentSubscription);
          await supabase.from('web_push_subscriptions').insert({
            user_id: user.id,
            subscription: serializedSub as unknown as JsonValue,
          });
          console.log('Re-added current subscription after cleanup');
        }
      }
    } catch (error) {
      console.error('Error cleaning up stale subscriptions:', error);
    }
  };

  const saveSubscriptionToSupabase = async (serializedSub: SerializablePushSubscription) => {
    if (!user) return;

    try {
      // Check if subscription already exists
      const {data: existingSubscription} = await supabase
        .from('web_push_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('subscription->endpoint', serializedSub.endpoint)
        .maybeSingle();

      if (existingSubscription) {
        // Update existing subscription
        await supabase
          .from('web_push_subscriptions')
          .update({
            subscription: serializedSub as unknown as JsonValue,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscription.id);
      } else {
        // Insert new subscription
        await supabase.from('web_push_subscriptions').insert({
          user_id: user.id,
          subscription: serializedSub as unknown as JsonValue,
        });
      }
    } catch (error) {
      console.error('Error saving subscription to Supabase:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save notification subscription',
        description: 'Please try again later.',
      });
    }
  };

  const removeSubscriptionFromSupabase = async (endpoint: string) => {
    if (!user) return;

    try {
      // Delete ALL subscriptions for this user instead of just the one with matching endpoint
      // This ensures we clean up any duplicate or stale subscriptions
      await supabase.from('web_push_subscriptions').delete().eq('user_id', user.id);

      // Log for debugging
      console.log('Removed all push subscriptions for user:', user.id);
    } catch (error) {
      console.error('Error removing subscription from Supabase:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to remove notification subscription',
        description: 'Please try again later.',
      });
    }
  };

  const handleSubscribe = async () => {
    // Prevent multiple simultaneous subscription attempts
    if (isSubscribing || isSubscribed) return;

    try {
      setIsSubscribing(true);

      // First, request notification permission if not already granted
      if (Notification.permission !== 'granted') {
        const permission = await requestNotificationPermission();

        // Update permission state
        setIsGranted(permission === 'granted');
        setIsDenied(permission === 'denied');

        // If permission denied, don't proceed with subscription
        if (permission !== 'granted') {
          setErrorMessage('Notification permission denied');
          toast({
            variant: 'destructive',
            title: 'Permission denied',
            description: 'You need to allow notifications in your browser settings.',
          });
          return;
        }
      }

      // Now proceed with subscription
      const onSubscribe = (pushSubscription: PushSubscription | null) => {
        if (pushSubscription) {
          // Convert to serializable format
          const serializedSub = serializeSubscription(pushSubscription);
          setIsSubscribed(true);
          setSubscription(serializedSub);

          // Save subscription to Supabase if user is logged in
          if (user) {
            saveSubscriptionToSupabase(serializedSub);
            toast({
              variant: 'success',
              title: t('subscribedTitle'),
              description: t('subscribedDescription'),
            });
          }
        }
        setIsGranted(isPermissionGranted());
        setIsDenied(isPermissionDenied());
      };

      const onError = (e: Error) => {
        console.error('Failed to subscribe cause of: ', e);
        setIsGranted(isPermissionGranted());
        setIsDenied(isPermissionDenied());
        setIsSubscribed(false);
        setErrorMessage(e?.message);
        toast({
          variant: 'destructive',
          title: t('subscribeErrorTitle'),
          description: t('subscribeErrorMessage'),
        });
      };

      registerAndSubscribe(onSubscribe, onError);
    } catch (error) {
      console.error('Error in handleSubscribe:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async (): Promise<void> => {
    // Prevent multiple simultaneous unsubscribe attempts
    if (isUnsubscribing || !isSubscribed) return;

    try {
      setIsUnsubscribing(true);
      console.log('Starting unsubscribe process');

      // If there's no subscription to unsubscribe from, just return
      if (!subscription) {
        console.log('No subscription to unsubscribe from');
        return;
      }

      // First update state to prevent multiple calls
      setIsSubscribed(false);

      // Get the current service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get the push subscription
      const pushSubscription = await registration.pushManager.getSubscription();

      // If there's an active subscription, unsubscribe from it
      if (pushSubscription) {
        try {
          console.log('Unsubscribing from browser push subscription');
          const success = await pushSubscription.unsubscribe();

          if (success) {
            // Remove from Supabase if unsubscribe was successful
            console.log('Browser unsubscribe successful, removing from database');
            await removeSubscriptionFromSupabase(subscription.endpoint);

            // Update state
            setSubscription(null);

            // Only show toast here, after everything is successful
            // Changed from 'destructive' to default variant for success message
            toast({
              variant: 'destructive',
              title: t('unsubscribedTitle'),
              description: t('unsubscribedDescription'),
            });
          } else {
            throw new Error('Failed to unsubscribe');
          }
        } catch (unsubError) {
          console.error('Error during unsubscribe operation:', unsubError);
          // Revert state if unsubscribe failed
          setIsSubscribed(true);
          throw unsubError;
        }
      } else {
        // No browser subscription found, but we had one in state
        // Just remove from Supabase and clear state
        console.log('No browser subscription found, cleaning up database');
        await removeSubscriptionFromSupabase(subscription.endpoint);
        setSubscription(null);

        // Changed from 'destructive' to default variant for success message
        toast({
          title: t('unsubscribedTitle'),
          description: t('unsubscribedDescription'),
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');

      // Only show error toast if we haven't already shown a success toast
      if (isSubscribed) {
        toast({
          variant: 'destructive',
          title: 'Failed to unsubscribe',
          description: 'Please try again later.',
        });
      }
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      isSupported,
      isSubscribed,
      isGranted,
      isDenied,
      subscription,
      errorMessage,
      handleSubscribe,
      handleUnsubscribe,
    }),
    [isSupported, isSubscribed, isGranted, isDenied, subscription, errorMessage],
  );

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
