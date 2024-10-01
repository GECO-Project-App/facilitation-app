import type {ButtonProps} from '@/components';
import {AboutProps, StepContent} from './types';

export const ccMock = {
  about: {
    rive: 'cc_main.riv',
  },
  checkIn: {
    about: {
      illustration: '/assets/svg/checkin-geco.svg',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/check-in' as string | URL,
        text: "Let's Start",
      },
    } as AboutProps,
  },
  checkOut: {
    about: {
      illustration: '/assets/svg/checkout-geco.svg',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/check-out',
        text: "Let's Start",
      },
    } as AboutProps,
  },
};

export const sscMock = {
  about: {
    rive: 'ssc_main.riv',
    button: {
      variant: 'yellow' as ButtonProps['variant'],
      link: '/exercises/ssc',
      text: "Let's Start",
    },
  } as AboutProps,
  start: {
    about: {
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
