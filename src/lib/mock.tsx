import {Button} from '@/components';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';

export const ccMock = {
  about: {
    title: 'Check In-Check Out Exercise',
    subtitle: '5-15 minutes | 2-20 members',
    description:
      'The "Check In-Check Out" exercise is a facilitation strategy used to enhance group participation, collaboration, and overall team engagement. It involves two main components: Check Ins and Check Outs.',
    rive: '/assets/riv/checkinout.riv',
  },
  checkIn: {
    about: {
      illustration: '/assets/svg/checkin-geco.svg',
      button: (text: string) => (
        <Button variant="yellow" asChild>
          <Link href={'/exercises/cc/check-in'}>
            {text} <ArrowRight size={28} />
          </Link>
        </Button>
      ),
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
      illustration: '/assets/svg/checkout-geco.svg',
      button: (text: string) => (
        <Button variant="yellow" asChild>
          <Link href={'/exercises/cc/check-out'}>
            {text} <ArrowRight size={28} />
          </Link>
        </Button>
      ),
    },
    questions: [
      'In two words… how was the experience from the session today?',
      'In one word… tell us how you are  feeling at the moment',
      'Think of three things that highlight this session',
      'Tell us one fun thing about the session!',
      'In one sentence…tell us what’s your concern today',
    ],
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
