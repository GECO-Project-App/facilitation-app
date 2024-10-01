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
};

export type ExerciseCardType = {
  title: string;
  subtitle: string;
  description: string;
  button: string;
  link: string;
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
