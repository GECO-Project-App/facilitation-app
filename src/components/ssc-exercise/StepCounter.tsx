import React from 'react';

interface StepCounterProps {
    currentStep: number;
    length: number;
}

const StepCounter: React.FC<StepCounterProps> = ({ currentStep, length }) => {
  const dotsBefore = '.'.repeat(currentStep - 1);
  const dotsAfter = '.'.repeat(length - currentStep);

  return (
    <div className="flex items-center justify-center">
      <div className="text-5xl pb-5">{dotsBefore}</div>
      <h2 className="text-4xl font-semibold border-2 border-black rounded-full p-1 w-12 h-12">{currentStep}</h2>
      <div className="text-5xl pb-5">{dotsAfter}</div>
    </div>
  );
};

export default StepCounter;
