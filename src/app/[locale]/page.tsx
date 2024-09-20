import {Button, RiveAnimation} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';

export default async function Home({params}: {params: {locale: string}}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-orange p-24">
      <div className="flex flex-col items-center gap-4">
        <RiveAnimation src="/assets/riv/bulbgecko.riv" width="160px" height="160px" />
        <h1 className="text-5xl font-bold uppercase tracking-[0.3em]">GECO</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Button variant="purple" asChild className="w-full">
          <Link href={'/exercises/cc/introduction'} locale={params.locale}>
            Check In - Check Out
          </Link>
        </Button>
        <Button variant="blue" asChild>
          <Link href={'/exercises/ssc/land-page'}>Start - Stop - Continue</Link>
        </Button>
      </div>
    </main>
  );
}
