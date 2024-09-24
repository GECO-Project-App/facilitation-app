import {Button} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';

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
      title: 'Check In Exercise',
      subtitle: '5-15 minutes | 2-20 members',
      description:
        'Check Ins are activities that help facilitators gather insights into the current thoughts or emotions of each group member. These can range from simple to more in-dept activities, such as, thumbs Up/thumbs Down, feelings check in, rate my day.',
      illustration: '/assets/svg/checkin-geco.svg',
      button: () => (
        <Button variant="yellow" asChild>
          <Link href={'/exercises/cc/check-in'}>
            Let's Start <ArrowRight size={28} />
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
      title: 'Check Out Exercise',
      subtitle: '5-15 minutes | 2-20 members',
      description:
        'Check Outs are used to close out a session and recap the experience. They help participants reflect on the entire session and express any final thoughts or feelings. Examples include; what was your biggest takeaway from todays session?, what would you like to see more or less of? show some appreciation to someone in this group who has inspired or supported you today, what next step do you plan to take?',
      illustration: '/assets/svg/checkout-geco.svg',
      button: () => (
        <Button variant="yellow" asChild>
          <Link href={'/exercises/cc/check-out'}>
            Let's Start <ArrowRight size={28} />
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
