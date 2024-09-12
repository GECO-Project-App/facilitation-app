'use client';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import { useParams } from 'next/navigation';
import { Timer } from '@/components';

export interface SSCExerciseProps {
  data: {
    id: string;
    title: string;
    step: number;
    imageOne: string | null | undefined;
    Instructions: string;
    imageTwo: string | null | undefined;
    description: string;
    timer?: number;
  }[];
}

const SSCExercise: React.FC<SSCExerciseProps> = ({data}) => {
  const router = useRouter();
  const { slug } = useParams();
  const [step, setStep] = useState(1);
  const stepData = data.find((item) => item.step === step);
  const goToNextStep = () => {
    setStep(step + 1);
    if (step === data.length) {
        router.push('/exercises/ssc');
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
          <h2 className="mb-2 text-xl font-semibold">{stepData.step}</h2>
          <p className="mb-4 text-lg">{stepData.Instructions}</p>
          <p className="text-base">{stepData.description}</p>
        </section>
        {stepData.imageOne && (
          <figure className="my-4">
            <img src={`/assets/png/${stepData.imageOne}`} alt="Step illustration"  />
          </figure>
        )}
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
