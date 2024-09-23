import {Button, NavBar, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function IntroductionPage() {
  const t = useTranslations('exercises.cc.about');

  return (
    <main className="page-padding flex min-h-screen flex-col justify-between bg-purple">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        <RiveAnimation src="/assets/riv/cc_main.riv" width={300} />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm font-light">{t('subtitle')}</p>
          <p>{t('description')}</p>
        </div>
        <Button variant="yellow" asChild className="mx-auto">
          <Link href={'/exercises/cc'}>
            {t('button')} <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </main>
  );
}
