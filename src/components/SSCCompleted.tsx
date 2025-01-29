'use client';
import {useRouter} from '@/i18n/routing';
import {ExerciseStage, TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useState} from 'react';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {SSCButtons} from './SSCButtons';
import {Button} from './ui/button';
import {VoteCard} from './VoteCard';

export const SSCCompleted = () => {
  const router = useRouter();
  const [stage, setStage] = useState<ExerciseStage>('start');
  const {exercise, teamExerciseData} = useExerciseStore();

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
        <Button variant="blue" className="mx-auto">
          Complete <Complete />
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
