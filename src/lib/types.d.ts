export type SSCExerciseType = {
  id: string;
  title: string;
  step: number;
  sticker: string | null;
  description: string | null;
  timer?: number;
};

export type ButtonType = {
  variant: 'green' | 'red' | 'pink' | 'blue' | 'orange' | 'purple' | 'yellow' | null | undefined;
  title: string;
  href: string;
  chapter?: 'start' | 'stop' | 'continue';
};

export type ExerciseCardType = {
  title: string;
  subtitle: string;
  description: string;
  button: string;
  link: string;
  type: 'check-in' | 'check-out' | 'ssc' | 'tutorial-to-me';
};

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
  rive?: string;
  illustration?: string;
  button: {
    variant: ButtonProps['variant'];
    link: string | URL;
    text: string;
  };
};

export type BaseballCardType = {
  member: Tables<'team_members'>;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Collapsible>;

export type Profile = {
  id: string;
  updated_at?: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
};

export type Team = {
  id: string;
  name: string;
  team_code: string;
  created_at: string;
  created_by: string;
  team_members: TeamMember[];
};

export type ExerciseType = {
  exerciseId: string;
  createdBy: string;
  teamId: string;
  writingDate: string;
  writingTime: string;
  reviewingDate: string;
  reviewingTime: string;
  isActive: boolean;
  reviewed: boolean;
  type: 'tutorial_to_me';
  replied_id: string;
  answers: {
    strengths: string;
    weaknesses: string;
    communications: string;
  };
};
