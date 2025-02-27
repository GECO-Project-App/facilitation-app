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
    case 'ssc':
      if (!user) {
        return false;
      }

      if (exercise === null && !isFacilitator) {
        return false;
      }

      if (exercise?.reviewing_deadline && new Date() > new Date(exercise.reviewing_deadline)) {
        if (isFacilitator) {
          return `/exercises/${slug}/deadline`;
        }
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

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
