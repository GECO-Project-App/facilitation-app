import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
import {Step} from '@/lib/types';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';

export default function SSC({params}: {params: {locale: string; slug: string}}) {
  const slug = params.slug;

  const tKey = useMemo(() => {
    switch (slug) {
      case 'start':
        return 'exercises.ssc.start';
      case 'stop':
        return 'exercises.ssc.stop';
      case 'continue':
        return 'exercises.ssc.continue';
      default:
        return 'exercises.ssc.start';
    }
  }, [slug]);

  const t = useTranslations(tKey);

  const steps: Step[] = t.raw('steps').map((step: Step) => step);

  switch (slug) {
    case 'tips':
      return <Tips />;
    default:
      return (
        <main className="">
          <SSCExercise chapter={slug} steps={steps} />
        </main>
      );
  }
}
