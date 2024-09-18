import {getDictionary} from '../../../dictionaries';
import {getSsdData} from '@/lib/ssc-mock-data';
import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
import FeedBack from '@/components/ssc-exercise/FeedBack';
import {About, Button, NavBar, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function CCPage({params}: {params: {lang: string; slug: string}}) {
  const t = await getDictionary(params.lang);
  const slug = params.slug;

  return (
    <main className="page-padding flex min-h-screen flex-col bg-orange">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto flex w-fit flex-col items-center space-y-16">
          <RandomQuestion excludeShapeColor={slug == 'check-in' ? Colors.Orange : Colors.Green} />
          <div>
            <Button variant="blue" asChild>
              <Link href={'/pass-it-on'}>
                Pass it on <ArrowRight size={28} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
