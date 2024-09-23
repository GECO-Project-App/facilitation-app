import {Button, NavBar, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function CheckInCheckOutPage() {
  const t = await getTranslations('exercises.cc');
  return (
    <main className="page-padding flex min-h-screen flex-col bg-yellow">
      <NavBar />
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center space-y-16">
        <Button variant="orange" className="self-end" asChild>
          <Link href={'/exercises/cc/check-in/introduction'}>
            {t('button.checkIn')} <ArrowRight size={28} />
          </Link>
        </Button>
        <RiveAnimation src="/assets/riv/timer.riv" height={160} width={160} />
        <Button variant="green" className="self-start" asChild>
          <Link href={'/exercises/cc/check-out/introduction'}>
            <ArrowLeft size={28} /> {t('button.checkOut')}
          </Link>
        </Button>
      </section>
    </main>
  );
}
