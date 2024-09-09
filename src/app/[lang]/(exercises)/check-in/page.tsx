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
    <main className="page-padding flex min-h-screen flex-col bg-orange">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-fit space-y-16">
          <RandomQuestion defaultColor={Colors.Yellow} />
          <div>
            <Link href={'/popcorn'}>
              <Button variant="pass" hasShadow className="mx-auto">
                Pass it on <ArrowRight size={28} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
