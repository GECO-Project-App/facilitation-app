import {About} from '@/components';
import {getTranslations} from 'next-intl/server';
import {useMemo} from 'react';

export default async function SSCIntroductionPage({
  params,
}: {
  params: {locale: string; slug: string};
}) {
  const {slug} = params;

  const t = await useMemo(async () => {
    switch (slug) {
      case 'start':
        return await getTranslations('exercises.ssc.start');
      case 'stop':
        return await getTranslations('exercises.ssc.stop');
      case 'continue':
        return await getTranslations('exercises.ssc.continue');
      default:
        return await getTranslations('exercises.ssc.star');
    }
  }, [slug]);

  return (
    <About
      slug={slug}
      title={t('title')}
      subtitle={t('subtitle')}
      description={t('description')}
      buttonText={t('button')}
    />
  );
}
