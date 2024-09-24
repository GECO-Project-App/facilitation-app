import React from 'react';

interface StepCounterProps {
    currentStep: number;
    length: number;
}

const StepCounter: React.FC<StepCounterProps> = ({ currentStep, length }) => {
  const dotsBefore = '.'.repeat(currentStep - 1);
  const dotsAfter = '.'.repeat(length - currentStep);

  return (
    <section className="flex items-center justify-center text-center">
      <div className="text-5xl pb-5">{dotsBefore}</div>
      <h2 className={`text-4xl font-semibold border-2 border-black rounded-full p-1 w-12 h-12 ${
        currentStep === 1 ? 'bg-orange' :
        currentStep === 2 ? 'bg-orange' :
        currentStep === 3 ? 'bg-pink' :
        currentStep === 4 ? 'bg-blue text-white' :
        currentStep === 5 ? 'bg-blue text-white' : ''    
    }`}>{currentStep}</h2>
      <div className="text-5xl pb-5">{dotsAfter}</div>
    </section>
  );
};

export default StepCounter;
