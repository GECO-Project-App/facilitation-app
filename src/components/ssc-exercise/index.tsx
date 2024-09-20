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
      doneChapters.push(chapter);
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
  console.log(stepData);

  const getRiv = () => {
    if (stepData.sticker) {
      return <RiveAnimation src={`/assets/riv/${stepData.sticker}`} />;
    }
  };

  return (
    <StyledWrapper>
      <article className="flex flex-col items-center justify-between h-40">
        <header className="flex w-full flex-row items-center justify-between pt-2">
          <ArrowLeft size={40} onClick={handleBack} />
          <h1 className="rounded-full border-2 border-black bg-yellow pr-4 pl-4 pt-1 pb-1 text-xl font-bold">
            {stepData.title}
          </h1>
          <div className="h-10 w-10 rounded-full bg-yellow"></div>
        </header>
        <section className="text-center">
          <StepCounter currentStep={step} length={data.length} />
        </section>
      </article>
      <article className="flex flex-1 flex-col items-center justify-evenly">
        {stepData.sticker && (
          <figure className="my-4">
            <RiveAnimation key={stepData.sticker} src={`/assets/riv/${stepData.sticker}`} />
          </figure>
        )}
        <p className="text-base">{stepData.description}</p>
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
