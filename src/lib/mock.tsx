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
    backgroundColor: 'bg-yellow',
    about: {
      rive: 'ssc_startgecko.riv',
      button: {
        variant: 'yellow' as ButtonProps['variant'],
        link: '/exercises/ssc/chapter/start',
        text: "Let's Start",
      },
    } as AboutProps,
    steps: [
      {
        sticker: 'ssc_start.riv',
      },
      {
        timer: 180,
      },
      {
        sticker: 'discussion.riv',
      },
      {
        sticker: 'ssc_prioritize.riv',
      },
    ] as StepContent[],
  },
  stop: {
    backgroundColor: 'bg-red',
    about: {
      rive: 'ssc_stopgecko.riv',
      button: {
        variant: 'red' as ButtonProps['variant'],
        link: '/exercises/ssc/chapter/stop',
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
        sticker: 'discussion.riv',
      },
      {
        sticker: 'ssc_prioritize.riv',
      },
    ] as StepContent[],
  },
  continue: {
    backgroundColor: 'bg-green',
    about: {
      rive: 'ssc_continuegecko.riv',
      button: {
        variant: 'green' as ButtonProps['variant'],
        link: '/exercises/ssc/chapter/continue',
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
        sticker: 'discussion.riv',
      },
      {
        sticker: 'ssc_prioritize.riv',
      },
    ] as StepContent[],
  },
};

export const tutorialMock = {
  about: {
    button: {
      variant: 'yellow' as ButtonProps['variant'],
      link: '/exercises/ttm/introduction',
      text: "Let's Start",
    },
  } as AboutProps,
};

export type PassItOnItem = {
  rive: string;
};
export const mockPassItOn: PassItOnItem[] = [
  {
    rive: 'passiton1.riv',
  },
  {
    rive: 'passiton2.riv',
  },
  {
    rive: 'passiton3.riv',
  },
];
