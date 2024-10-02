import React, {FC} from 'react';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Link} from '@/navigation';
import {PageLayout} from '../PageLayout';
import {getTranslations} from 'next-intl/server';

const FeedBack: FC = async () => {
  const t = await getTranslations('exercises.ssc.feedback');
  return (
    <PageLayout backgroundColor="bg-yellow">
      <section className="flex w-full flex-row items-center justify-start gap-4">
        <Link href={'/exercises/ssc'}>
          <ArrowLeft size={42} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="font-light">{t('subtitle')}</p>
        </div>
      </section>
      <h4 className="text-md font-semibold">{t('description')}</h4>

      <Button variant="yellow" asChild className="mx-auto">
        <Link href={'/'}>{t('button')}</Link>
      </Button>
    </PageLayout>
  );
};

export default FeedBack;
