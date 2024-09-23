import {Button, RiveAnimation} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {getDictionary} from './dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Home({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-orange p-24">
      <div className="flex flex-col items-center gap-4">
        <RiveAnimation src="bulbgecko.riv" height={160} width={160} />
        <h1 className="text-5xl font-bold uppercase tracking-[0.3em]">GECO</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Button variant="purple" asChild className="w-full">
          <Link href={'/exercises/cc/introduction'}>Check In - Check Out</Link>
        </Button>
        <Button variant="blue" asChild>
          <Link href={'/exercises/ssc/land-page'}>Start - Stop - Continue</Link>
        </Button>
      </div>
    </main>
  );
}
