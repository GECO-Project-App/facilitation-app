import {Button, NavBar, RiveAnimation} from '@/components';
import ClearLocalStorage from '@/components/ssc-exercise/ClearLocalStorage';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function SSCIntroductionPage() {
  const t = await getTranslations('exercises.ssc.about');

  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-blue text-white">
      <ClearLocalStorage />
      <NavBar />
      <section>
        <RiveAnimation src="ssc_main.riv" width={240} height={240} />
      </section>
      <section>
        <header>
          <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
          <h2 className="mb-4 text-xl">{t('subtitle')}</h2>
        </header>
        <p>{t('description')}</p>
      </section>
      <Link href={'/exercises/ssc'}>
        <Button variant="pink" className="mx-auto">
          {t('button')} <ArrowRight size={28} />
        </Button>
      </Link>
    </main>
  );
}
