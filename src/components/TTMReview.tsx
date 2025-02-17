'use client';
import {Button, DateBadge, Header, PageLayout, RiveAnimation, SwipeFeed} from '@/components';
import {Complete} from '@/components/icons';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {ArrowRight, Check} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

export const TTMReview = ({isCompleted = false}: {isCompleted?: boolean}) => {
  const router = useRouter();
  const t = useTranslations('exercises.tutorialToMe');
  const t2 = useTranslations('common');
  const searchParams = useSearchParams();
  const {toast} = useToast();

  const {exercise, reviewedStages, setReviewedStages, setExerciseDataAsReviewed} =
    useExerciseStore();

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
      header={
        <Header
          rightContent={<DateBadge date={new Date()} />}
          onBackButton={() => router.push('/activities')}
        />
      }
      footer={
        isCompleted ? null : (
          <Button
            variant="white"
            disabled={reviewedStages.length < 3}
            onClick={() => {
              const reviewedExercise = setExerciseDataAsReviewed(exercise.id);
              if (reviewedExercise) {
                setReviewedStages(null);
                toast({
                  variant: 'transparent',
                  size: 'fullscreen',
                  duration: 2000,
                  className: 'text-black bg-blue',
                  children: (
                    <>
                      <h3 className="text-3xl font-bold">{t2('greatJob')}</h3>
                      <RiveAnimation src="geckograttis.riv" width={300} height={300} />
                    </>
                  ),
                });
              }
            }}>
            {t('review.button')} <Complete />
          </Button>
        )
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
