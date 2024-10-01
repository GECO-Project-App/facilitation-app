import {ExerciseCard, RiveAnimation, LanguageSelector, Constraints} from '@/components';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
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
    <section className="min-h-screen bg-yellow">
      <Constraints>
        <section className="justify-betweenn flex flex-col items-center">
          <div className="space-y-6 p-6">
            <header className="flex w-full flex-row items-center justify-center">
              <LanguageSelector />
            </header>
            <div className="flex flex-col items-center gap-4 p-4">
              <RiveAnimation src="bulbgecko.riv" height={160} width={160} />
              <h1 className="text-5xl font-bold uppercase tracking-[0.3em]">GECO</h1>
            </div>
          </div>
          <div className="divide-y-2 divide-black border-y-2 border-black md:border-x-2">
            {catalogue.map((exercise, index) => (
              <ExerciseCard key={index} {...exercise} />
            ))}
          </div>
        </section>
      </Constraints>
    </section>
  );
}
