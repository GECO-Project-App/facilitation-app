'use client';
import {useRouter} from '@/i18n/routing';
import {TeamExerciseData} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {Check} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect} from 'react';
import {Complete} from './icons';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui/button';

export const SwipeFeed: FC<{stage: string}> = ({stage}) => {
  const t = useTranslations('exercises.tutorialToMe');
  const {teamExerciseData, getTeamExerciseData, setReviewedStages, reviewedStages} =
    useExerciseStore();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id') as string;
  const status = searchParams.get('status') as string;
  const router = useRouter();

  useEffect(() => {
    if (exerciseId) {
      getTeamExerciseData(exerciseId);
    }
  }, [exerciseId, getTeamExerciseData]);

  return (
    <div
      className={cn(
        stage === 'strengths' && 'bg-yellow',
        stage === 'weaknesses' && 'bg-pink',
        stage === 'communication' && 'bg-orange',
        'absolute inset-0 overflow-y-scroll snap-mandatory snap-y shadow-dark rounded-4xl border-2 border-black p-6',
      )}>
      <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-2xl font-bold text-center">
        {t(`stages.${stage}`)}
      </h2>
      <div className="w-full h-full snap-start snap-always flex flex-col items-center justify-center">
        <RiveAnimation src="swipe_up.riv" height={160} width={160} />
        <h3 className="text-center">{t('review.swipe.read')}</h3>
      </div>
      {teamExerciseData &&
        teamExerciseData.map((entry: TeamExerciseData, index: number) => (
          <div
            key={index}
            className="w-full h-full snap-start snap-always flex items-center justify-center">
            <div className="gap-8 flex flex-col w-full">
              <h3 className="text-2xl font-bold break-words">{entry.author_name}</h3>
              <h3 className="text-2xl break-words">{entry.data[stage].value}</h3>
            </div>
          </div>
        ))}
      <div className="w-full h-full snap-start snap-always flex flex-col items-center justify-center gap-8">
        <h2 className=" text-2xl font-bold text-center">
          {t('review.swipe.done', {stage: t(`stages.${stage}`).toLowerCase()})}
        </h2>
        <Button
          variant="white"
          onClick={() => {
            if (!reviewedStages.includes(stage) && status !== 'completed') {
              setReviewedStages(stage);
            }
            router.back();
          }}>
          {reviewedStages.includes(stage) ? (
            <>
              {t('review.swipe.reviewed')} <Check />
            </>
          ) : (
            <>
              {t('review.swipe.markAsReviewed')} <Complete />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
