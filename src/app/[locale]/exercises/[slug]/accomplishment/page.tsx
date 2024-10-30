'use client';
import {Button, PageLayout, RiveAnimation} from '@/components';
import {Link} from '@/i18n/routing';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';

export default function ExerciseAccomplishment({params}: {params: {slug: string}}) {
  const t = useTranslations('exercises.ssc.accomplishment');
  const {slug} = params;

  const isSSCCompleted = useMemo(() => {
    if (slug !== 'ssc') {
      return false;
    }
    const storedValue = localStorage.getItem('chapterDone') || '[]';
    const chaptersDone: string[] = JSON.parse(storedValue);
    return chaptersDone.length === 3;
  }, [slug]);

  return (
    <PageLayout
      backgroundColor="bg-blue"
      contentColor="bg-blue"
      footer={
        slug === 'ssc' ? (
          isSSCCompleted ? (
            <Button variant="pink" className="mx-auto" asChild>
              <Link href={`/exercises/${slug}/feedback`}>
                {t('feedbackButton')}
                <ArrowRight size={28} />
              </Link>
            </Button>
          ) : (
            <Button variant="pink" className="mx-auto" asChild>
              <Link href={`/exercises/ssc`}>{t('homeButton')}</Link>
            </Button>
          )
        ) : (
          <Button variant="pink" className="mx-auto" asChild>
            <Link href={`/exercises/${slug}/feedback`}>
              {t('feedbackButton')}
              <ArrowRight size={28} />
            </Link>
          </Button>
        )
      }>
      <section className="flex flex-1 flex-col items-center space-y-6">
        <div className="flex flex-1 flex-col items-center justify-center space-y-16">
          <h2 className="text-3xl font-bold text-white">{t('title')}</h2>
          <div className="flex aspect-square items-center justify-center rounded-full bg-pink">
            <RiveAnimation src="geckograttis.riv" width={300} height={300} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
