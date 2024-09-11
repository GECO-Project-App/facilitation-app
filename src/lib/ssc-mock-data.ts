const startData = [
  {
    id: 'start-1',
    title: 'Formulate',
    step: 1,
    imageOne:'',
    Instructions: 'Pick a main topic on what you wanna discuss today with the community.',
    imageTwo:'',
    description: 'What are we not doing that we might start doing as a community?',
    timer: 0,
},
{
    id: 'start-2',
    title: 'Silent Brainstorm',
    step: 2,
    imageOne:'',
    Instructions: 'Use this step to think of one thing that each one would like to start doing.',
    imageTwo:'',
    description: 'They have three minutes to brainstorm silently.',
    timer: 3,
  },
  {
    id: 'start-3',
    title: 'Review & Discussion',
    step: 3,
    imageOne:'',
    Instructions: 'Review and discuss that one thing, let everyone shares their point.',
    imageTwo:'',
    description: 'Prioritize which issues, and what can we propose.',
    timer: 0,
  },
];

const stopData = [
  {
    id: 'stop-1',
    title: 'Formulate',
    step: 1,
    imageOne:'',
    Instructions: '',
    imageTwo:'',
    description: 'What have we been doing that we might/should stop doing as a community?',
    timer: 0,
},
{
    id: 'stop-2',
    title: 'Silent Brainstorm',
    step: 2,
    imageOne:'',
    Instructions: 'Use this step to think of one thing that each one would like to stop doing.',
    imageTwo:'',
    description: 'They have three minutes to brainstorm silently.',
    timer: 3,
  },
  {
    id: 'stop-3',
    title: 'Review & Discussion',
    step: 3,
    imageOne:'',
    Instructions: 'Review and discuss that one thing, let everyone shares their point.',
    imageTwo:'',
    description: 'Prioritize which issues, and what can we propose.',
    timer: 0,
  },
];


const continueData = [
  {
    id: 'continue-1',
    title: 'Formulate',
    step: 1,
    imageOne:'',
    Instructions: '',
    imageTwo:'',
    description: 'What can we continue doing?',
    timer: 0,
},
{
    id: 'continue-2',
    title: 'Silent Brainstorm',
    step: 2,
    imageOne:'',
    Instructions: 'Use this step to think of one thing that each one would like to continue doing.',
    imageTwo:'',
    description: 'They have three minutes to brainstorm silently.',
    timer: 3,
  },
  {
    id: 'continue-3',
    title: 'Review & Discussion',
    step: 3,
    imageOne:'',
    Instructions: 'Review and discuss that one thing, let everyone shares their point.',
    imageTwo:'',
    description: 'Prioritize which issues, and what can we propose.',
    timer: 0,
  },
];

export const getSsdData = (type: string) => {
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