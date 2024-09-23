import {Button, NavBar, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {ccMock} from '@/lib/mock';
import {cn} from '@/lib/utils';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {getDictionary} from '../../../dictionaries';

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
    <main
      className={cn(
        slug === 'check-in' ? 'bg-orange' : 'bg-green',
        'page-padding flex min-h-screen flex-col',
      )}>
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto flex w-fit flex-col items-center space-y-16">
          <RandomQuestion
            type={slug as 'check-in' | 'check-out'}
            excludeShapeColor={slug == 'check-in' ? Colors.Orange : Colors.Green}
            items={slug == 'check-in' ? ccMock.checkIn.questions : ccMock.checkOut.questions}
          />
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
