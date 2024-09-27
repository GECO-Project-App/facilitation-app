import {Button, NavBar, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {cn} from '@/lib/utils';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function CCPage({params}: {params: {slug: string}}) {
  const slug = params.slug;
  const t = await getTranslations('exercises.cc');

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
            slug={slug}
            excludeShapeColor={slug == 'check-in' ? Colors.Orange : Colors.Green}
          />
          <div>
            <Button variant="blue" asChild>
              <Link href={'/pass-it-on'}>
                {t('passItOnButton')} <ArrowRight size={28} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}