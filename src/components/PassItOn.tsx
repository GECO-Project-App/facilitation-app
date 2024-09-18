'use client';
import {mockPassItOn} from '@/lib/mock';
import {cn} from '@/lib/utils';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {FC, useState} from 'react';
import {HomeButton} from './HomeButton';
import {BackButton} from './NavBar/BackButton';
import {Button} from './ui';

export const PassItOn: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToPreviousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => (prev < mockPassItOn.length - 1 ? prev + 1 : prev));
  };

  const Navigation = () => (
    <nav className={cn('flex w-full flex-row items-center justify-between gap-4')}>
      {currentStep === 0 ? (
        <BackButton />
      ) : (
        <button onClick={goToPreviousStep} disabled={currentStep === 0}>
          <ArrowLeft size={42} />
        </button>
      )}

      <div className="whitespace-nowrap rounded-full border-2 border-black bg-yellow px-6 py-2 font-semibold">
        Pass It On Method
      </div>

      <button
        onClick={goToNextStep}
        className={cn(currentStep === mockPassItOn.length - 1 ? 'invisible' : '')}>
        <ArrowRight size={42} />
      </button>
    </nav>
  );

  return (
    <section className="flex min-h-screen flex-col justify-between p-4">
      <Navigation />
      <div className="">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div
            className={cn(
              currentStep === 0 ? 'bg-yellow' : '',
              currentStep === 1 ? 'bg-pink' : '',
              currentStep === 2 ? 'bg-green' : '',
              'aspect-square h-11 w-11 rounded-full border-2 border-black p-1 text-2xl font-semibold text-black',
            )}>
            {currentStep + 1}
          </div>

          {mockPassItOn[currentStep].illustration()}
          <p className="text-white">{mockPassItOn[currentStep].instruction}</p>
          {currentStep < mockPassItOn.length - 1 && (
            <Button onClick={goToNextStep} variant="pink">
              Next step <ArrowRight size={32} />
            </Button>
          )}
        </div>
      </div>
      <nav className="flex items-center justify-between gap-4">
        {currentStep === 0 ? (
          <BackButton />
        ) : (
          <button onClick={goToPreviousStep} disabled={currentStep === 0}>
            <ArrowLeft size={42} />
          </button>
        )}
        <HomeButton />
      </nav>
    </section>
  );
};
