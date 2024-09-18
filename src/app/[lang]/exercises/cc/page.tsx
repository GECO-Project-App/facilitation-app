import {Button, NavBar, RiveAnimation} from '@/components';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {getDictionary} from '../../dictionaries';
import Link from 'next/link';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function CheckInCheckOutPage({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="page-padding flex min-h-screen flex-col bg-yellow">
      <NavBar />
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center space-y-16">
        <Button variant="orange" className="self-end" asChild>
          <Link href={'/exercises/cc/check-in/introduction'}>
            1.Check In <ArrowRight size={28} />
          </Link>
        </Button>
        <RiveAnimation src="/assets/riv/timer.riv" height={160} width={160} />
        <Button variant="green" className="self-start" asChild>
          <Link href={'/exercises/cc/check-out/introduction'}>
            <ArrowLeft size={28} /> 2.Check Out
          </Link>
        </Button>
      </section>
    </main>
  );
}
