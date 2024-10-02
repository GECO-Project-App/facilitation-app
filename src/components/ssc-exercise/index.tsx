'use client';
import {PageLayout, RiveAnimation, Timer} from '@/components';
import StepCounter from '@/components/ssc-exercise/StepCounter';
import DescriptionWrapper from '@/components/styles/DescriptionWrapper';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
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

const SSCExercise: React.FC<SSCExerciseProps> = ({chapter, steps}) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const mock = useMemo(() => {
    switch (chapter) {
      case 'start':
        return sscMock.start.steps;
      case 'stop':
        return sscMock.stop.steps;
      case 'continue':
        return sscMock.continue.steps;
      default:
        return sscMock.start.steps;
    }
  }, [chapter]);

  const goToNextStep = () => {
    if (step === steps.length - 1) {
      router.push('/exercises/ssc/accomplishment');
      const localStorageChaptersData = localStorage.getItem('chapterDone');
      const doneChapters = localStorageChaptersData ? JSON.parse(localStorageChaptersData) : [];
      if (!doneChapters.includes(chapter)) {
        doneChapters.push(chapter);
      }
      localStorage.setItem('chapterDone', JSON.stringify(doneChapters));
    }
    setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  if (!steps) {
    return <div>Loading...</div>;
  }

  const goToPreviousStep = () => {
    if (step === 0) {
      router.back();
    }
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <PageLayout>
      <article className="flex h-40 flex-col items-center justify-between">
        <HeaderWrapper title={steps[step].title} handleBack={goToPreviousStep} currentStep={step} />
        <StepCounter currentStep={step} length={steps.length - 1} />
      </article>
      <article className="flex flex-1 flex-col items-center justify-evenly">
        {mock[step]?.sticker && (
          <RiveAnimation key={mock[step].sticker} src={mock[step].sticker} width={300} />
        )}
        <DescriptionWrapper>{steps[step].description}</DescriptionWrapper>
        {mock[step]?.timer && <Timer seconds={mock[step].timer} />}
        <footer className="mt-8">
          <Button variant="pink" onClick={goToNextStep}>
            {steps[step].button} <ArrowRight size={28} />
          </Button>
        </footer>
      </article>
    </PageLayout>
  );
};

export default SSCExercise;
