import {About} from '@/components';
import {ccMock} from '@/lib/mock';
import {useTranslations} from 'next-intl';

export default async function IntroductionPage({params}: {params: {locale: string; slug: string}}) {
  const {slug} = params;

  return <About slug={slug} />;
}
