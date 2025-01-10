import {About, PageLayout} from '@/components';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';

export default function ExerciseDetailPage({params}: {params: {id: string; slug: string}}) {
  const {id, slug} = params;

  const tKey = useMemo(() => {
    switch (slug) {
      case 'check-in':
        return 'exercises.checkIn';
      case 'check-out':
        return 'exercises.checkOut';
      case 'ssc':
        return 'exercises.ssc.about';
      case 'start':
        return 'exercises.ssc.start';
      case 'stop':
        return 'exercises.ssc.stop';
      case 'continue':
        return 'exercises.ssc.continue';
      case 'tutorial-to-me':
        return 'exercises.tutorialToMe';
      default:
        return slug;
    }
  }, [slug]);

  const t = useTranslations(tKey);
  return (
    <PageLayout>
      <About
        slug={slug as string}
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        buttonText={t('button')}
        hideTeamSelect={true}
      />
    </PageLayout>
  );
}
