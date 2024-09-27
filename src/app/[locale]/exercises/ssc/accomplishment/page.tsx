import {Button, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function Accomplishment() {
  const t = await getTranslations('exercises.ssc.accomplishment');
  return (
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-fit text-center">
          <div className="mb-12 text-white">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <h2 className="text-xl font-bold">{t('subtitle')}</h2>
          </div>
          <div className="flex flex-col items-center space-y-12">
            <div className="m-2 mx-auto rounded-full bg-pink p-2">
              <RiveAnimation src="geckograttis.riv" />
            </div>
            <Link href={'/exercises/feedback/ssc'}>
              <Button variant="pink" className="mx-auto">
                {t('button')}
                <ArrowRight size={28} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
