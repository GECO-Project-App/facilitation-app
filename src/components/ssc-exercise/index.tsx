'use client';
import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Timer} from '@/components';
import StepCounter from '@/components/ssc-exercise/StepCounter';
import {ArrowLeft} from 'lucide-react';
import StyledWrapper from '@/components/styles/StyledWrapper';
import {RiveAnimation} from '@/components';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
import DescriptionWrapper from '@/components/styles/DescriptionWrapper';

export interface SSCExerciseProps {
  chapter: string;
  data: {
    id: string;
    title: string;
    step: number;
    sticker: string | null;
    description: string | null;
    timer?: number;
  }[];
}

const SSCExercise: React.FC<SSCExerciseProps> = ({data, chapter}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const stepData = data.find((item) => item.step === step);

  const goToNextStep = () => {
    setStep(step + 1);
    if (step === data.length) {
      router.push('/exercises/ssc/accomplishment');
      const localStorageChaptersData = localStorage.getItem('chapterDone');
      const doneChapters = localStorageChaptersData ? JSON.parse(localStorageChaptersData) : [];
      if (!doneChapters.includes(chapter)) {
        doneChapters.push(chapter);
      }
      localStorage.setItem('chapterDone', JSON.stringify(doneChapters));
    }
  };
  if (!stepData) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const getRiv = () => {
    if (stepData.sticker) {
      return <RiveAnimation src={`/assets/riv/${stepData.sticker}`} />;
    }
  };

  return (
    <StyledWrapper>
      <article className="flex h-40 flex-col items-center justify-between">
        <HeaderWrapper title={stepData.title} handleBack={handleBack} currentStep={step} />
        <StepCounter currentStep={step} length={data.length} />
      </article>
      <article className="flex flex-1 flex-col items-center justify-evenly">
        {stepData.sticker && (
          <RiveAnimation key={stepData.sticker} src={stepData.sticker} width={300} />
        )}
        <DescriptionWrapper>{stepData.description}</DescriptionWrapper>
        {stepData.timer && <Timer seconds={stepData.timer} />}
        <footer className="mt-8">
          <Button variant="pink" onClick={goToNextStep}>
            Next Step <ArrowRight size={28} />
          </Button>
        </footer>
      </article>
    </StyledWrapper>
  );
};

export default SSCExercise;
