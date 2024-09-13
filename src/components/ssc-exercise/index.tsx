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
      <article className="flex flex-1 flex-col items-center justify-evenly">
        <header>
          <h1 className="w-fit rounded-full border-2 border-black bg-yellow p-4 text-3xl font-bold">
            {stepData.title}
          </h1>
        </header>
        <section className="text-center">
          <h2 className="mb-2 text-xl font-semibold border-2 border-black rounded-full p-2 w-12 h-12 items-center m-auto">{stepData.step}</h2>
        </section>
        {stepData.sticker && (
          <figure className="my-4">
            <img src={`/assets/svg/${stepData.sticker}`} alt="Step illustration"  />
          </figure>
        )}
        <p className="text-base">{stepData.description}</p>
        {stepData.timer && <Timer seconds = {stepData.timer}/>}
        <footer className="mt-8">
          <Button variant="checkin" onClick={goToNextStep} hasShadow>
            Next Step <ArrowRight size={28} />
          </Button>
        </footer>
      </article>
    </main>
  );
};

export default SSCExercise;
