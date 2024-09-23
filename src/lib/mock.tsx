import type {ButtonProps} from '@/components';

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
    rive: '/assets/riv/checkinout.riv',
  } as AboutProps,
  checkIn: {
    about: {
      title: 'Check In Exercise',
      subtitle: '5-15 minutes | 2-20 members',
      description:
        'Check Ins are activities that help facilitators gather insights into the current thoughts or emotions of each group member. These can range from simple to more in-dept activities, such as, thumbs Up/thumbs Down, feelings check in, rate my day.',
      illustration: '/assets/svg/checkin-geco.svg',

      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/cc/check-in' as string | URL,
        text: "Let's Start",
      },
    },
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
      title: 'Check Out Exercise',
      subtitle: '5-15 minutes | 2-20 members',
      description:
        'Check Outs are used to close out a session and recap the experience. They help participants reflect on the entire session and express any final thoughts or feelings. Examples include; what was your biggest takeaway from todays session?, what would you like to see more or less of? show some appreciation to someone in this group who has inspired or supported you today, what next step do you plan to take?',
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
      rive: '/assets/riv/ssc_startgecko.riv',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/ssc/start',
        text: "Let's Start",
      },
    } as AboutProps,
  },
  stop: {
    about: {
      title: 'Chapter 2: Stop',
      subtitle: '4-5 minutes | 2-20 members',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you should stop doing as a community to better support the productivity, communication, etc. Give an example of how this point might help you and the community to thrive.',
      rive: '/assets/riv/ssc_stopgecko.riv',
      button: {
        variant: 'red' as ButtonProps['variant'],
        link: '/exercises/ssc/stop',
        text: "Let's Stop",
      },
    } as AboutProps,
  },
  continue: {
    about: {
      title: 'Chapter 3: Continue',
      subtitle: '4-5 minutes | 2-20 members',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you should continue doing as a community to better support the productivity, communication, etc. Give an example of how this might help you and the community to thrive.',
      rive: '/assets/riv/ssc_continuegecko.riv',
      button: {
        variant: 'green' as ButtonProps['variant'],
        link: '/exercises/ssc/continue',
        text: "Let's Continue",
      },
    } as AboutProps,
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
