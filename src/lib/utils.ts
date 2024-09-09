import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {ShapeColors, Colors} from './constants';
import {mockPopcorn, mockQuestions} from './mock';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const generateRandomNumberInRange = (max: number) => Math.floor(Math.random() * max);
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

export const getRandomColor = (colors: typeof ShapeColors | typeof Colors): string => {
  const colorKeys = Object.keys(colors);
  const randomIndex = generateRandomNumberInRange(colorKeys.length);
  return colors[colorKeys[randomIndex] as keyof typeof colors];
};

// export const getRandomQuestion = (): string => {
//   const randomIndex = generateRandomNumberInRange(mockQuestions.length);
//   const question = mockQuestions[randomIndex];
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('checkinQuestion', question);
//   }
//   return question;
// };

// export const getRandomPopcornPrompt = (): string => {
//   const randomIndex = generateRandomNumberInRange(mockPopcorn.length);
//   const prompt = mockPopcorn[randomIndex];
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('popcornPrompt', prompt);
//   }
//   return prompt;
// };
