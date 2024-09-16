export interface SSCExerciseProps {
    data: {
      id: string;
      title: string;
      step: number;
      imageOne: string;
      Instructions: string;
      imageTwo: string;
      description: string;
      timer?: number;
    }[];
  }