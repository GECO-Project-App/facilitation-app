import {User} from '@supabase/supabase-js';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {Exercise, TeamExerciseData} from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomNumberInRange = (max: number) => Math.floor(Math.random() * max);
/**
 * Selects a random object from an array, but never one that has been chosen before.
 * @param array Array to choose from
 * @param previousPicks Array of previously selected objects
 * @returns A randomly selected object or undefined if all objects have been selected
 */
export function getRandomUniqueItem<T>(array: T[], previousPicks: T[]): T | undefined {
  const availableItems = array.filter((item) => !previousPicks.includes(item));

  if (availableItems.length === 0) {
    return undefined;
  }

  const randomIndex = generateRandomNumberInRange(availableItems.length);
  return availableItems[randomIndex];
}

export const generateUserSlug = (firstName?: string, lastName?: string) => {
  return encodeURIComponent(`${firstName?.toLocaleLowerCase()}-${lastName?.toLocaleLowerCase()}`);
};

export const getPathnameWithoutLocale = (pathname: string) => {
  return pathname.split('/', 2).slice(1).join('/');
};

export const extractReviews = (exerciseData: TeamExerciseData[]) => {
  // Define the desired category order
  const categoryOrder = Object.keys(exerciseData[0].data);
  // First, collect all reviews
  const reviews = exerciseData.flatMap((item) => {
    const dataKeys = Object.keys(item.data);

    return dataKeys
      .map((key) => ({
        author_name: item.author_name,
        author_id: item.author_id,
        category: key,
        id: item.id,
        value: item.data[key].value,
      }))
      .filter((review) => review.value); // Only include reviews with values
  });

  // Filter and sort reviews based on categoryOrder
  return reviews
    .filter((review) => categoryOrder.includes(review.category))
    .sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });
};

export const checkExerciseAvailibility = (
  slug: string,
  isFacilitator: boolean,
  user: User | null,
  exercise: Exercise | null,
) => {
  switch (slug) {
    case 'ttm':
      if (!user) {
        return false;
      }
      if (exercise === null && !isFacilitator) {
        return false;
      }

      return true;
    case 'ssc':
      if (!user) {
        return false;
      }
      if (exercise === null && !isFacilitator) {
        return false;
      }

      return true;
    default:
      return true;
  }
};

export const getExerciseColor = (type: string) => {
  switch (type) {
    case 'check-in':
      return 'bg-purple';
    case 'check-out':
      return 'bg-green';
    case 'ssc':
      return 'bg-orange';
    case 'ttm':
      return 'bg-red';
  }
};

const SERVICE_WORKER_FILE_PATH = '/sw.js';

export function notificationUnsupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return unsupported;
}

export function checkPermissionStateAndAct(
  onSubscribe: (subs: PushSubscription | null) => void,
): void {
  const state: NotificationPermission = Notification.permission;
  switch (state) {
    case 'denied':
      break;
    case 'granted':
      registerAndSubscribe(onSubscribe);
      break;
    case 'default':
      break;
  }
}

async function subscribe(onSubscribe: (subs: PushSubscription | null) => void): Promise<void> {
  navigator.serviceWorker.ready
    .then((registration: ServiceWorkerRegistration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
    })
    .then((subscription: PushSubscription) => {
      console.info('Created subscription Object: ', subscription.toJSON());
      submitSubscription(subscription).then((_) => {
        onSubscribe(subscription);
      });
    })
    .catch((e) => {
      console.error('Failed to subscribe cause of: ', e);
    });
}

async function submitSubscription(subscription: PushSubscription): Promise<void> {
  const endpointUrl = '/api/web-push/subscription';
  const res = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({subscription}),
  });
  const result = await res.json();
  console.log(result);
}

export async function registerAndSubscribe(
  onSubscribe: (subs: PushSubscription | null) => void,
): Promise<void> {
  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    await subscribe(onSubscribe);
  } catch (e) {
    console.error('Failed to register service-worker: ', e);
  }
}

export async function sendWebPush(message: string | null): Promise<void> {
  const endPointUrl = '/api/web-push/send';
  const pushBody = {
    title: 'Test Push',
    body: message ?? 'This is a test push message',
    image: '/next.png',
    icon: 'nextjs.png',
    url: 'https://google.com',
  };
  const res = await fetch(endPointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pushBody),
  });
  const result = await res.json();
  console.log(result);
}
