export const mockQuestions = [
  'If you could describe your current state of mind in three words, what would they be?',
  "What's one thing you're looking forward to this week?",
  'If you were a weather phenomenon, what would you be today and why?',
  "What's one small win you've had recently?",
  'If you could have any superpower for just today, what would it be?',
  "What's one thing you've learned in the past week?",
  'If your mood was a color right now, what color would it be?',
  "What's one thing you're grateful for today?",
  'If you could teleport anywhere for your next break, where would you go?',
  "What's one goal you're working towards right now?",
];

export const mockPopcorn = [
  'who has a dog',
  'who has a cat',
  'who has met a celebrity',
  'who has a daughter',
  'who likes herring',
];

export type PassItOnItem = {
  id: number;
  instruction: string;
  rive: string;
};
export const mockPassItOn: PassItOnItem[] = [
  {
    id: 1,
    instruction: 'Pick a person to answer the question first.',
    rive: '/assets/riv/pick.riv',
  },
  {
    id: 2,
    instruction: 'Once that person gave their answer, they pick who should answer next.',
    rive: '/assets/riv/passit.riv',
  },
  {
    id: 3,
    instruction: 'Repeat this process until everyone has answered the question.',
    rive: '/assets/riv/repeat2.riv',
  },
];
