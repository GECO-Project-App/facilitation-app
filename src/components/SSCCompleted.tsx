'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {ExerciseStage, TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {SSCButtons} from './SSCButtons';
import {VoteCard} from './VoteCard';
import {Complete} from './icons';
import {Button} from './ui/button';

export const SSCCompleted = () => {
  const router = useRouter();
  const [stage, setStage] = useState<ExerciseStage>('start');
  const {exercise, teamExerciseData} = useExerciseStore();
  const t = useTranslations('common');
  const {toast} = useToast();

  return (
    <PageLayout
      backgroundColor="bg-orange"
      header={
        <Header
          onBackButton={() => router.replace('/exercises/ssc/introduction')}
          rightContent={<DateBadge date={exercise?.deadline.reviewingPhase ?? new Date()} />}
        />
      }
      footer={
        <Button
          variant="blue"
          onClick={() => {
            router.push(`/exercises/ssc/feedback`);
            toast({
              variant: 'transparent',
              size: 'fullscreen',
              duration: 2000,
              className: 'text-black bg-blue',
              children: (
                <>
                  <h3 className="text-3xl font-bold">{t('greatJob')}</h3>
                  <RiveAnimation src="geckograttis.riv" width={300} height={300} />
                </>
              ),
            });
          }}>
          {t('complete')} <Complete />
        </Button>
      }>
      <div className="flex flex-col gap-8 h-full w-full flex-1 ">
        <SSCButtons selectedStage={stage as ExerciseStage} onClick={setStage} />
        {teamExerciseData &&
          teamExerciseData.map((entry: TeamExerciseData, index: number) => (
            <VoteCard
              key={index}
              type={stage}
              text={entry.data[stage].value}
              vote={entry.data[stage].vote}
            />
          ))}
      </div>
    </PageLayout>
  );
};
