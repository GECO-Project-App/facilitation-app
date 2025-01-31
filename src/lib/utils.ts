import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {TeamExerciseData} from './types';

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
