'use client';
import {Button, DateBadge, Header, PageLayout, SwipeFeed} from '@/components';
import {Complete} from '@/components/icons';
import {useRouter} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

export default function TTMReviewPage() {
  //TODO: status != review -> Show waiting screen
  const router = useRouter();
  const t = useTranslations('exercises.tutorialToMe');
  const searchParams = useSearchParams();

  if (searchParams.get('status')) {
    return (
      <section className="min-h-svh h-full w-full p-8 max-w-lg mx-auto flex flex-col gap-4">
        <div className="hidden lg:block">
          <Header />
        </div>
        {/* <Progress value={50} /> */}
        <main className="flex-1 relative">
          <SwipeFeed />
        </main>
      </section>
    );
  }

  return (
    <PageLayout
      hasPadding={false}
      backgroundColor="bg-purple"
      header={<Header rightContent={<DateBadge date={new Date()} />} />}
      footer={
        <Button variant="white">
          Review complete <Complete />
        </Button>
      }>
      <div className="divide-y-2 divide-black border-y-2 border-black border-x-2">
        {Object.keys(t.raw('stages')).map((stage, index) => (
          <div
            key={index}
            className={cn(
              'p-4 gap-4 flex flex-col pb-6',
              stage === 'strengths' && 'bg-yellow',
              stage === 'weaknesses' && 'bg-pink',
              stage === 'communication' && 'bg-orange',
            )}>
            <h3 className="text-2xl font-bold">{t(`stages.${stage}`)}</h3>
            <p>{t('review.description')}</p>
            <Button
              variant="white"
              size="small"
              className="mx-auto"
              onClick={() => router.push(`/exercises/ttm/review?status=review&stage=${stage}`)}>
              Let&apos;s get started <ArrowRight />
            </Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
