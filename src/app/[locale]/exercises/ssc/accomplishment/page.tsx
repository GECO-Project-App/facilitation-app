import {Button, PageLayout, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function Accomplishment() {
  const t = await getTranslations('exercises.ssc.accomplishment');
  return (
    <PageLayout backgroundColor="bg-blue">
      <section className="flex flex-1 flex-col items-center space-y-6">
        <div className="flex flex-1 flex-col items-center justify-center space-y-16">
          <h2 className="text-3xl font-bold text-white">{t('title')}</h2>
          <div className="flex aspect-square items-center justify-center rounded-full bg-pink">
            <RiveAnimation src="geckograttis.riv" width={300} height={300} />
          </div>
        </div>
        <Link href={'/exercises/ssc'}>
          <Button variant="pink" className="mx-auto">
            {t('homeButton')}
            <ArrowRight size={28} />
          </Button>
        </Link>
      </section>
    </PageLayout>
  );
}
