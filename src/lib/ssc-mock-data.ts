import { ButtonType, SSCExerciseType } from "./types";

const startData: SSCExerciseType[] = [
  {
    id: 'start-1',
    title: 'Formulate',
    step: 1,
    sticker: 'topic.riv',
    description: 'Pick a main topic on what you wanna discuss today with the community.',
  },
  {
    id: 'start-2',
    title: 'Start',
    step: 2,
    sticker: 'ssc_start.riv',
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
    sticker: 'discuss.riv',
    description: 'Prioritize which issues, and what can we propose.',
  },
  {
    id: 'start-5',
    title: 'Proritize',
    step: 5,
    sticker: 'priority.riv',
    description: 'Review and discuss that one thing, let everyone shares their point.',
  },
];

const stopData: SSCExerciseType[] = [
  {
    id: 'stop-1',
    title: 'Formulate',
    step: 1,
    sticker: 'ssc_stop.riv',
    description: 'What have we been doing that we might/should stop doing as a community?',
  },
  {
    id: 'stop-2',
    title: 'Silent Brainstorm',
    step: 2,
    sticker: null,
    description: 'Use this step to think of one thing that each one would like to start doing. They have three minutes to brainstorm silently.',
    timer: 180,
  },
  {
    id: 'stop-3',
    title: 'Review & Discussion',
    step: 3,
    sticker: 'discuss.riv',
    description: 'Review and discuss that one thing, let everyone shares their point.',
  },
  {
    id: 'stop-4',
    title: 'Proritize',
    step: 4,
    sticker: 'priority.riv',
    description: 'Prioritize which issues, and what can we propose.',
  },
];

const continueData: SSCExerciseType[] = [
  {
    id: 'continue-1',
    title: 'Formulate',
    step: 1,
    sticker: 'ssc_continue.riv',
    description: 'What can we continue doing?',
  },
  {
    id: 'continue-2',
    title: 'Silent Brainstorm',
    step: 2,
    sticker: null,
    description: 'Use this step to think of one thing that each one would like to start doing. They have three minutes to brainstorm silently.',
    timer: 180,
  },
  {
    id: 'stop-3',
    title: 'Review & Discussion',
    step: 3,
    sticker: 'discuss.riv',
    description: 'Review and discuss that one thing, let everyone shares their point.',
  },
  {
    id: 'stop-4',
    title: 'Proritize',
    step: 4,
    sticker: 'priority.riv',
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


export const buttons: ButtonType[] = [
  {
    title: 'START',
    href: '/exercises/ssc/introduction?chapter=start',
    variant: 'green',
  },
  {
    title: 'STOP',
    href: '/exercises/ssc/introduction?chapter=stop',
    variant: 'red',
  },
  {
    title: 'CONTINUE',
    href: '/exercises/ssc/introduction?chapter=continue',
    variant: 'pink',
  },
];
