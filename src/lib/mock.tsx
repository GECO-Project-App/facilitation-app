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
    backgroundColor: 'bg-red',
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
    backgroundColor: 'bg-green',
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
