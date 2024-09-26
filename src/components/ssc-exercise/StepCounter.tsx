import React from 'react';

interface StepCounterProps {
  currentStep: number;
  length: number;
}

const StepCounter: React.FC<StepCounterProps> = ({currentStep, length}) => {
  const dotsBefore = '.'.repeat(currentStep);
  const dotsAfter = '.'.repeat(length - currentStep);

  return (
    <section className="flex items-center justify-center text-center">
      <div className="pb-5 text-5xl">{dotsBefore}</div>
      <h2
        className={`h-12 w-12 rounded-full border-2 border-black p-1 text-4xl font-semibold ${
          currentStep === 1
            ? 'bg-orange'
            : currentStep === 2
              ? 'bg-orange'
              : currentStep === 3
                ? 'bg-pink'
                : currentStep === 4
                  ? 'bg-blue text-white'
                  : currentStep === 5
                    ? 'bg-blue text-white'
                    : ''
        }`}>
        {currentStep + 1}
      </h2>
      <div className="pb-5 text-5xl">{dotsAfter}</div>
    </section>
  );
};

export default StepCounter;
