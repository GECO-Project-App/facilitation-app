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

export async function registerAndSubscribe(
  onSubscribe: (subs: PushSubscription | null) => void,
  onError: (e: Error) => void,
): Promise<void> {
  try {
    // await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    //subscribe to notification
    navigator.serviceWorker.ready
      .then((registration: ServiceWorkerRegistration) => {
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
      })
      .then((subscription: PushSubscription) => {
        console.info('Created subscription Object: ', subscription.toJSON());
        onSubscribe(subscription);
      })
      .catch((e) => {
        onError(e);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    onError(e);
  }
}
