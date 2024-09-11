'use client';
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';


export interface SSCExerciseProps {
    data: {
        id: number;
        title: string;
    step: number;
    imageOne: string;
    Instructions: string;
    imageTwo:string;
    description: string;
    timer: number;
}[]
}

const SSCExercise = ({data}:SSCExerciseProps) => {
    const [step, setStep] = useState(1);
    console.log(data);
    console.log(step);
    const goToNextStep = () => {
        console.log('next step');
    }
  return (
    <div className="flex flex-col items-center justify-center">
      {data.map((item) => (
        <div key={item.id}>
            <h1>{item.title}</h1>
        </div>
      ))}
      <Button variant="checkin"  onClick={goToNextStep} >
        Next Step
      </Button>
    </div>
  );
};

export default SSCExercise;
