import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
import {Step} from '@/lib/types';
import {getTranslations} from 'next-intl/server';
import {useMemo} from 'react';

export default async function SSC({params}: {params: {locale: string; slug: string}}) {
  const slug = params.slug;

  const t = await useMemo(async () => {
    switch (slug) {
      case 'start':
        return await getTranslations('exercises.ssc.start');
      case 'stop':
        return await getTranslations('exercises.ssc.stop');
      case 'continue':
        return await getTranslations('exercises.ssc.continue');
      default:
        return await getTranslations('exercises.ssc.start');
    }
  }, [slug]);

  const steps: Step[] = t.raw('steps').map((step: Step) => step);

  switch (slug) {
    case 'tips':
      return <Tips />;
    default:
      return (
        <main
          className={`flex min-h-screen flex-col ${
            slug === 'start'
              ? 'bg-yellow'
              : slug === 'stop'
                ? 'bg-red'
                : slug === 'continue'
                  ? 'bg-green'
                  : 'bg-blue'
          }`}>
          <SSCExercise chapter={slug} steps={steps} />
        </main>
      );
  }
}
