import {Header, PageLayout} from '@/components';
import {ActivityItem} from '@/components/ActivityItem';
import {Link} from '@/i18n/routing';
import {Bell} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function ActivitiesPage() {
  const t = await getTranslations('activities');

  return (
    <PageLayout
      hasPadding={false}
      header={
        <Header
          showBackButton={false}
          rightContent={
            <Link href="/notifications">
              <Bell size={24} />
            </Link>
          }>
          <h4 className=" font-bold">{t('title')}</h4>
        </Header>
      }>
      <div className="flex flex-col divide-y-2 divide-black ">
        {Array.from({length: 10}).map((_, index) => (
          <ActivityItem key={index} hasBottomBorder={index === 9} />
        ))}
      </div>
    </PageLayout>
  );
}
