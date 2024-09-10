import {Button, NavBar, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {ArrowRight} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {getDictionary} from '../../dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Checkin({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-evenly">
            <Link href={'/popcorn'}>
              <Button variant="checkout" hasShadow className="mx-auto">
                START
              </Button>
            </Link>
            <Link href={'/popcorn'}>
              <Button variant="stop" hasShadow className="mx-auto"  size="circle">
                STOP
              </Button>
            </Link>
            <Link href={'/popcorn'}>
              <Button variant="checkin" hasShadow className="mx-auto">
                CONTINUE
              </Button>
            </Link>
            <Link href={'/popcorn'}>
              <Button variant="back" hasShadow className="mx-auto">
                Feedback
              </Button>
            </Link>
      </section>
    </main>
  );
}
