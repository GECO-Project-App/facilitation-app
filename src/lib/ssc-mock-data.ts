
interface SSCExerciseProps {
    id: string;
    title: string;
    step: number;
    sticker: string | null;
    description: string | null;
    timer?: number;
}

const startData: SSCExerciseProps[] = [
  {
    id: 'start-1',
    title: 'Formulate',
    step: 1,
    sticker: 'topic.svg',
    description: 'Pick a main topic on what you wanna discuss today with the community.',
  },
  {
    id: 'start-2',
    title: 'Start',
    step: 2,
    sticker: 'start.svg',
    description: 'What are we not doing that we might start doing as a community?',
  },
  {
    id: 'start-3',
    title: 'Silent Brainstorm',
    step: 3,
    sticker: null,
    description: 'Use this step to think of one thing that each one would like to start doing. They have three minutes to brainstorm silently.',
    timer: 180,
  },
  {
    id: 'start-4',
    title: 'Review & Discussion',
    step: 4,
    sticker: 'discuss.svg',
    description: 'Prioritize which issues, and what can we propose.',
  },
  {
    id: 'start-5',
    title: 'Proritize',
    step: 5,
    sticker: 'prior.svg',
    description: 'Review and discuss that one thing, let everyone shares their point.',
  },
];

const stopData: SSCExerciseProps[] = [
  {
    id: 'stop-1',
    title: 'Formulate',
    step: 1,
    sticker: '',
    description: 'What have we been doing that we might/should stop doing as a community?',
  },
  {
    id: 'stop-2',
    title: 'Silent Brainstorm',
    step: 2,
    sticker: '',
    description: 'They have three minutes to brainstorm silently.',
    timer: 180,
  },
  {
    id: 'stop-3',
    title: 'Review & Discussion',
    step: 3,
    sticker: '',
    description: 'Prioritize which issues, and what can we propose.',
  },
];

const continueData: SSCExerciseProps[] = [
  {
    id: 'continue-1',
    title: 'Formulate',
    step: 1,
    sticker: '',
    description: 'What can we continue doing?',
  },
  {
    id: 'continue-2',
    title: 'Silent Brainstorm',
    step: 2,
    sticker: '',
    description: 'Use this step to think of one thing that each one would like to continue doing.',
    timer: 180,
  },
  {
    id: 'continue-3',
    title: 'Review & Discussion',
    step: 3,
    sticker: '',
    description: 'Prioritize which issues, and what can we propose.',
  },
];

export const getSsdData = (type: string)=> {
  switch (type) {
    case 'start':
      return startData;
    case 'stop':
      return stopData;
    case 'continue':
      return continueData;
    default:
      return undefined;
  }
};
