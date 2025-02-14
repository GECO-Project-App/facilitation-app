import {Header, NotificationItem, PageLayout} from '@/components';
import {createClient} from '@/lib/supabase/server';
import {getTranslations} from 'next-intl/server';

export default async function NotificationsPage() {
  const supabase = createClient();
  const t = await getTranslations('notifications');
  const {data: notifications} = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', {ascending: false});

  return (
    <PageLayout
      backgroundColor="bg-purple"
      contentColor="bg-purple"
      header={
        <Header>
          <h4 className=" font-bold">{t('title')}</h4>
        </Header>
      }>
      <div className=" flex-1 flex flex-col gap-6">
        {notifications ? (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <p>{t('noNotifications')}</p>
        )}
      </div>
    </PageLayout>
  );
}
