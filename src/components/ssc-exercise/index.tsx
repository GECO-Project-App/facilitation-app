'use client';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import { useParams } from 'next/navigation';

export interface SSCExerciseProps {
  data: {
    id: string;
    title: string;
    step: number;
    imageOne: string;
    Instructions: string;
    imageTwo: string;
    description: string;
    timer: number;
  }[];
}

const SSCExercise = ({data}: SSCExerciseProps) => {
  const [step, setStep] = useState(1);
  const stepData = data.find((item) => item.step === step);
  const goToNextStep = () => {
    setStep(step + 1);
  };
  const { slug } = useParams()
//   console.log(slug)

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <h1>{stepData?.title}</h1>
      </div>
      <Button variant="checkin" onClick={goToNextStep}>
        Next Step
      </Button>
    </div>
  );
};

export default SSCExercise;
