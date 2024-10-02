import {Button, NavBar, PageLayout, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function CheckOutPage({params}: {params: {slug: string}}) {
  const slug = params.slug;
  const t = await getTranslations('exercises.checkOut');

  return (
    <PageLayout backgroundColor="bg-green">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <RandomQuestion slug={slug} excludeShapeColor={Colors.Green} />
      </section>

      <Button variant="blue" asChild className="mx-auto">
        <Link href={'/pass-it-on'}>
          {t('passItOnButton')} <ArrowRight size={28} />
        </Link>
      </Button>
    </PageLayout>
  );
}
