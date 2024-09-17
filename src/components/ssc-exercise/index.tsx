'use client';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import {useRouter} from 'next/navigation';
import { Timer } from '@/components';

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

  return (
    <main className="page-padding flex min-h-screen flex-col">
      <article className="flex flex-1 flex-col items-center justify-between">
        <header className='pt-6'>
          <h1 className="rounded-full border-2 border-black bg-yellow p-4 text-xl font-bold mt-2">
            {stepData.title}
          </h1>
        </header>
        <section className="text-center">
          <StepCounter currentStep={step} length={data.length} />
        </section>
        {stepData.sticker && (
          <figure className="my-4">
            <img src={`/assets/svg/${stepData.sticker}`} alt="Step illustration" />
          </figure>
        )}
        <p className="text-base">{stepData.description}</p>
        {stepData.timer && <Timer seconds = {stepData.timer}/>}
        <footer className="mt-8">
          <Button variant="pink" onClick={goToNextStep}>
            Next Step <ArrowRight size={28} />
          </Button>
        </footer>
      </article>
    </main>
  );
};

export default SSCExercise;
