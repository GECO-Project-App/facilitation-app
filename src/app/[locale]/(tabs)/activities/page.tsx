import {AuthTabs, Header, PageLayout, PushNotificationBanner} from '@/components';
import {ActivityItem} from '@/components/ActivityItem';
import {TabBarNotification} from '@/components/TabBarNotification';
import {Link} from '@/i18n/routing';
import {getUserTeamActivities} from '@/lib/actions/exerciseActions';
import {createClient} from '@/lib/supabase/server';
import {cn} from '@/lib/utils';
import {Bell, ListTodo} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function ActivitiesPage() {
  const t = await getTranslations('activities');
  const {data, error} = await getUserTeamActivities();
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <PageLayout
        header={
          <Header
            showBackButton={false}
            rightContent={
              <div className="flex flex-row items-center gap-2">
                <h4 className=" font-bold">{t('title')}</h4>

                <ListTodo size={24} />
              </div>
            }
          />
        }>
        <AuthTabs />
      </PageLayout>
    );
  }
  return (
    <PageLayout
      backgroundColor="bg-purple"
      contentColor="bg-purple"
      header={
        <Header
          showBackButton={false}
          rightContent={
            user && (
              <Link href="/notifications">
                {/* <RiveAnimation
                src="notif.riv"
                width={32}
                height={32}
                triggers={['notif']}
                stateMachines={[
                  notifications && notifications.length > 0
                    ? 'activities_notif'
                    : 'activities_neutral',
                ]}
              /> */}
                <div className="relative">
                  <Bell size={26} />
                  <TabBarNotification showNumber />
                </div>
              </Link>
            )
          }>
          <Link href="/test">
            <h4 className="font-bold">{t('title')}</h4>
          </Link>
        </Header>
      }>
      <PushNotificationBanner />
      <div className={cn('flex flex-col flex-1 gap-4')}>
        {data && data.length > 0 ? (
          data?.map((activity, index) => <ActivityItem key={index} activity={activity} />)
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center">
            <p className="text-2xl font-bold">{t('noActivities')}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
