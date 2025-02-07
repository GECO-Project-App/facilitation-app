import {ExerciseCard, Header, PageLayout} from '@/components';
import {ExerciseCardType} from '@/lib/types';
import {Library} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function ExerciseCatalogue() {
  const t = await getTranslations('exerciseCatalogue');
  const catalogue: ExerciseCardType[] = t.raw('catalogue');

  return (
    <PageLayout
      header={
        <Header
          showBackButton={false}
          rightContent={
            <div className="flex flex-row items-center gap-2">
              <h4 className=" font-bold">{t('title')}</h4>
              <Library size={24} />
            </div>
          }
        />
      }>
      <div className="gap-4 flex flex-col">
        {catalogue.map((exercise, index) => (
          <ExerciseCard key={index} {...exercise} />
        ))}
      </div>
    </PageLayout>
  );
}
