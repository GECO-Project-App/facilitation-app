'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import { RiveAnimation, Timer } from '@/components';
import StepCounter from '@/components/ssc-exercise/StepCounter';
import DescriptionWrapper from '@/components/styles/DescriptionWrapper';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
import StyledWrapper from '@/components/styles/StyledWrapper';
import { Button } from '@/components/ui/button';
import { sscMock, Step } from '@/lib/mock';
import {Button} from '@/components/ui/button';
import {sscMock} from '@/lib/mock';
import {Step} from '@/lib/types';
import {useRouter} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import React, {useMemo, useState} from 'react';

export interface SSCExerciseProps {
  chapter: string;
  steps: Step[];
}

const SSCExercise: React.FC<SSCExerciseProps> = ({ chapter, steps }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const chapterSteps = useMemo(() => {
    const chapterMap = {
      start: sscMock.start.steps,
      stop: sscMock.stop.steps,
      continue: sscMock.continue.steps,
    };
    return chapterMap[chapter as keyof typeof chapterMap] || sscMock.start.steps;
  }, [chapter]);

  const areAllChaptersComplete = (completedChapters: string[]): boolean => {
    const requiredChapters = ['start', 'stop', 'continue'];
    return requiredChapters.every((chapter) => completedChapters.includes(chapter));
  };

  const handleNextStep = () => {
    if (currentStep === steps.length - 1) {
      const completedChapters = JSON.parse(localStorage.getItem('chapterDone') || '[]');
      if (!completedChapters.includes(chapter)) {
        completedChapters.push(chapter);
        localStorage.setItem('chapterDone', JSON.stringify(completedChapters));
      }
      
      router.push(
        areAllChaptersComplete(completedChapters)
          ? '/exercises/feedback/ssc'
          : '/exercises/ssc/accomplishment'
      );
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!steps) {
    return <div>Loading...</div>;
  }

  const currentStepData = steps[currentStep];

  return (
    <StyledWrapper>
      <article className="flex h-40 flex-col items-center justify-between">
        <HeaderWrapper
          title={currentStepData.title}
          handleBack={handlePreviousStep}
          currentStep={currentStep}
        />
        <StepCounter currentStep={currentStep} length={steps.length - 1} />
      </article>
      <article className="flex flex-1 flex-col items-center justify-evenly">
        {chapterSteps[currentStep]?.sticker && (
          <RiveAnimation
            key={chapterSteps[currentStep].sticker}
            src={chapterSteps[currentStep].sticker}
            width={300}
          />
        )}
        <DescriptionWrapper>{currentStepData.description}</DescriptionWrapper>
        {chapterSteps[currentStep]?.timer && (
          <Timer seconds={chapterSteps[currentStep].timer} />
        )}
        <footer className="mt-8">
          <Button variant="pink" onClick={handleNextStep}>
            {currentStepData.button} <ArrowRight size={28} />
          </Button>
        </footer>
      </article>
    </StyledWrapper>
  );
};

export default SSCExercise;
