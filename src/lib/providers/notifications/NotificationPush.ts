const SERVICE_WORKER_FILE_PATH = 'worker/index.js';

export function isNotificationSupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return !unsupported;
}

export function isPermissionGranted(): boolean {
  return Notification.permission === 'granted';
}

export function isPermissionDenied(): boolean {
  return Notification.permission === 'denied';
}

/**
 * Request notification permission from the browser
 * @returns Promise that resolves to the permission status
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported in this browser');
  }

  // If permission is already granted or denied, return current status
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }

  // Request permission
  return await Notification.requestPermission();
}

/**
 * Register service worker and subscribe to push notifications
 */
export async function registerAndSubscribe(
  onSubscribe: (subs: PushSubscription | null) => void,
  onError: (e: Error) => void,
): Promise<void> {
  try {
    // Ensure permission is granted before subscribing
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    try {
      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      onSubscribe(subscription);
    } catch (error) {
      onError(
        error instanceof Error ? error : new Error('Failed to subscribe to push notifications'),
      );
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}
