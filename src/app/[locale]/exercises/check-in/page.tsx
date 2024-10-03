import {Button, NavBar, PageLayout, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {cn} from '@/lib/utils';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function CheckInPage({params}: {params: {slug: string}}) {
  const slug = params.slug;
  const t = await getTranslations('exercises.checkIn');

  const questions: string[] = t.raw('questions').map((question: string) => question);

  return (
    <PageLayout backgroundColor="bg-orange">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <RandomQuestion slug={slug} excludeShapeColor={Colors.Orange} questions={questions} />
      </section>

      <Button variant="blue" asChild className="mx-auto">
        <Link href={'/pass-it-on'}>
          {t('passItOnButton')} <ArrowRight size={28} />
        </Link>
      </Button>
    </PageLayout>
  );
}
