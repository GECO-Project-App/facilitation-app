import type {ButtonProps} from '@/components';

export type Step = {
  title: string;
  description: string;
  button: string;
};

export type StepContent = {
  sticker?: string;
  timer?: number;
};

export type AboutProps = {
  title: string;
  subtitle: string;
  description: string;
  rive?: string;
  illustration?: string;
  button: {
    variant: ButtonProps['variant'];
    link: string | URL;
    text: string;
  };
};

export const ccMock = {
  about: {
    title: 'Check In-Check Out Exercise',
    subtitle: '5-15 minutes | 2-20 members',
    description:
      'The "Check In-Check Out" exercise is a facilitation strategy used to enhance group participation, collaboration, and overall team engagement. It involves two main components: Check Ins and Check Outs.',
    rive: 'cc_main.riv',
  },
  checkIn: {
    about: {
      illustration: '/assets/svg/checkin-geco.svg',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/cc/check-in' as string | URL,
        text: "Let's Start",
      },
    } as AboutProps,
    questions: [
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
    ],
  },
  checkOut: {
    about: {
      illustration: '/assets/svg/checkout-geco.svg',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/cc/check-out',
        text: "Let's Start",
      },
    } as AboutProps,
    questions: [
      'In two words… how was the experience from the session today?',
      'In one word… tell us how you are  feeling at the moment',
      'Think of three things that highlight this session',
      'Tell us one fun thing about the session!',
      'In one sentence…tell us what’s your concern today',
    ],
  },
};

export const sscMock = {
  start: {
    about: {
      title: 'Chapter 1: Start',
      subtitle: '4-5 minutes | 2-20 members',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you could start doing as a community to better support the productivity, communication, etc. Give an example of how this might help you and the community to thrive.',
      rive: 'ssc_startgecko.riv',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/ssc/start',
        text: "Let's Start",
      },
    } as AboutProps,
    steps: [
      {
        sticker: 'topic.riv',
      },
      {
        sticker: 'ssc_start.riv',
      },
      {
        timer: 180,
      },
      {
        sticker: 'discuss.riv',
      },
      {
        sticker: 'priority.riv',
      },
    ] as StepContent[],
  },
  stop: {
    about: {
      title: 'Chapter 2: Stop',
      subtitle: '4-5 minutes | 2-20 members',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you should stop doing as a community to better support the productivity, communication, etc. Give an example of how this point might help you and the community to thrive.',
      rive: 'ssc_stopgecko.riv',
      button: {
        variant: 'red' as ButtonProps['variant'],
        link: '/exercises/ssc/stop',
        text: "Let's Stop",
      },
    } as AboutProps,
    steps: [
      {
        sticker: 'ssc_stop.riv',
      },

      {
        timer: 180,
      },

      {
        sticker: 'discuss.riv',
      },
      {
        sticker: 'priority.riv',
      },
    ] as StepContent[],
  },
  continue: {
    about: {
      title: 'Chapter 3: Continue',
      subtitle: '4-5 minutes | 2-20 members',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you should continue doing as a community to better support the productivity, communication, etc. Give an example of how this might help you and the community to thrive.',
      rive: 'ssc_continuegecko.riv',
      button: {
        variant: 'green' as ButtonProps['variant'],
        link: '/exercises/ssc/continue',
        text: "Let's Continue",
      },
    } as AboutProps,
    steps: [
      {
        sticker: 'ssc_continue.riv',
      },

      {
        timer: 180,
      },

      {
        sticker: 'discuss.riv',
      },
      {
        sticker: 'priority.riv',
      },
    ] as StepContent[],
  },
};

export type PassItOnItem = {
  id: number;
  instruction: string;
  rive: string;
};
export const mockPassItOn: PassItOnItem[] = [
  {
    id: 1,
    instruction: 'Pick a person to answer the question first.',
    rive: 'pick.riv',
  },
  {
    id: 2,
    instruction: 'Once that person gave their answer, they pick who should answer next.',
    rive: 'passit.riv',
  },
  {
    id: 3,
    instruction: 'Repeat this process until everyone has answered the question.',
    rive: 'repeat2.riv',
  },
];
