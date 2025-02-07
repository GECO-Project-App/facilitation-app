import {Header, NotificationItem, PageLayout} from '@/components';

export default function NotificationsPage() {
  return (
    <PageLayout
      backgroundColor="bg-purple"
      contentColor="bg-purple"
      header={
        <Header>
          <h4 className=" font-bold">Notifications</h4>
        </Header>
      }>
      <div className=" flex-1 flex flex-col gap-6">
        {Array.from({length: 10}).map((_, index) => (
          <NotificationItem key={index} />
        ))}
      </div>
    </PageLayout>
  );
}
