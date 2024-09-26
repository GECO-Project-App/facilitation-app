export interface SSCExerciseType {
  id: string;
  title: string;
  step: number;
  sticker: string | null;
  description: string | null;
  timer?: number;
}

export interface ButtonType {
  variant: 'green' | 'red' | 'pink' | 'blue' | 'orange' | 'purple' | 'yellow' | null | undefined;
  title: string;
  href: string;
}
