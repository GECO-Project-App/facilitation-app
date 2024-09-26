import {About} from '@/components';
import {AboutProps, ccMock} from '@/lib/mock';
import {getTranslations} from 'next-intl/server';
import {useMemo} from 'react';

export default async function IntroductionPage({params}: {params: {locale: string; slug: string}}) {
  const {slug} = params;

  return <About slug={slug} />;
}
