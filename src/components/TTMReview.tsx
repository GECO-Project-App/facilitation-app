'use client';
import {Button, DateBadge, Header, PageLayout, SwipeFeed} from '@/components';
import {Complete} from '@/components/icons';
import {useRouter} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {ArrowRight, Check} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

export const TTMReview = () => {
  //TODO: status != review -> Show waiting screen
  const router = useRouter();
  const t = useTranslations('exercises.tutorialToMe');
  const searchParams = useSearchParams();
  const {pendingUsers, exercise, reviewedStages, setReviewedStages} = useExerciseStore();

  if (searchParams.get('stage')) {
    return (
      <section className="min-h-svh h-full w-full p-8 max-w-lg mx-auto flex flex-col gap-4">
        <div className="hidden lg:block">
          <Header />
        </div>
        {/* <Progress value={50} /> */}
        <main className="flex-1 relative">
          <SwipeFeed stage={searchParams.get('stage') as string} />
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
        <Button
          variant="white"
          disabled={reviewedStages.length < 2}
          onClick={() => {
            console.log('clicked');
            setReviewedStages(null);
          }}>
          {t('review.button')} <Complete />
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
              onClick={() => router.push(`${window.location.href}&stage=${stage}`)}>
              {reviewedStages.includes(stage) ? (
                <>
                  {t('review.startButton.reviewed')} <Check />
                </>
              ) : (
                <>
                  {t('review.startButton.start')} <ArrowRight />
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};
