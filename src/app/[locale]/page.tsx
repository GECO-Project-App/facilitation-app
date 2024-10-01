import {ExerciseCard, RiveAnimation} from '@/components';
import {ExerciseCardType} from '@/lib/types';

import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('home');
  return {
    title: t('title'),
    description: t('desc'),
  };
}

export default async function Home() {
  const t = await getTranslations('home');
  const catalogue: ExerciseCardType[] = t.raw('catalogue');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-orange">
      <div className="flex flex-col items-center gap-4">
        <RiveAnimation src="bulbgecko.riv" height={160} width={160} />
        <h1 className="text-5xl font-bold uppercase tracking-[0.3em]">GECO</h1>
      </div>
      <div className="divide-y-2 divide-black border-y-2 border-black md:border-x-2">
        {catalogue.map((exercise, index) => (
          <ExerciseCard key={index} {...exercise} />
        ))}
      </div>
    </main>
  );
}
