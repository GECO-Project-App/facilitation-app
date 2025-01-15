'use client';
import {Button, DateBadge, Header, PageLayout} from '@/components';
import {Complete} from '@/components/icons';
import {cn} from '@/lib/utils';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function TTMReviewPage() {
  //TODO: status != review -> Show waiting screen
  const t = useTranslations('exercises.tutorialToMe');

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
            <p>{t('reviewDescription')}</p>
            <Button variant="white" size="small" className="mx-auto">
              Let&apos;s get started <ArrowRight />
            </Button>
          </div>
        ))}
      </div>
    </PageLayout>
    // <section className="min-h-svh h-full w-full p-8 max-w-lg mx-auto flex flex-col gap-4">
    //   <div className="hidden lg:block">
    //     <Header />
    //   </div>
    //   <Progress value={50} />
    //   <main className="flex-1 relative">
    //     <SwipeFeed />
    //   </main>
    // </section>
  );
}
