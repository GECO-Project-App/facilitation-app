import {Header, PageLayout} from '@/components';
import {ActivityItem} from '@/components/ActivityItem';
import {getUserTeamActivities} from '@/lib/actions/exerciseActions';
import {getTranslations} from 'next-intl/server';

export default async function ActivitiesPage() {
  const t = await getTranslations('activities');
  const {data, error} = await getUserTeamActivities();

  return (
    <PageLayout
      hasPadding={false}
      header={
        <Header
          showBackButton={false}
          // rightContent={
          //   <Link href="/notifications">
          //     <Bell size={24} />
          //   </Link>
          // }
        >
          <h4 className="font-bold">{t('title')}</h4>
        </Header>
      }>
      <div className="flex flex-col divide-y-2 divide-black flex-1">
        {data?.map((activity, index) => (
          <ActivityItem
            key={index}
            hasBottomBorder={index === data.length - 1}
            activity={activity}
          />
        ))}
        {data?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="font-bold">{t('noActivities')}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
