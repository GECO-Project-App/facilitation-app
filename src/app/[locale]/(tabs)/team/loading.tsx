import {Header, PageLayout} from '@/components';
import {Skeleton} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageLayout
      header={
        <Header showBackButton={false}>
          <Skeleton className="w-full p-4 rounded-full" />
        </Header>
      }>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
          <Skeleton className="w-full h-32 rounded-4xl" />
        </div>
        <div className="grid gap-2 lg:gap-4 grid-cols-2">
          {Array.from({length: 4}).map((_, index) => (
            <Skeleton key={index} className="w-full h-64 rounded-4xl" />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
