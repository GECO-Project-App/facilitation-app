'use client';

import {ExerciseStage, TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {SSCButtons} from './SSCButtons';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const {getTeamExerciseData, handleExerciseVote, teamExerciseData} = useExerciseStore();
  const searchParams = useSearchParams();
  const stage = (searchParams.get('stage') as ExerciseStage) ?? 'start';
  const exerciseId = searchParams.get('id') as string;
  const [cards, setCards] = useState<TeamExerciseData[]>([]);
  const t = useTranslations('exercises.ssc');
  const router = useRouter();

  const getNextStage = (currentStage: ExerciseStage): ExerciseStage | null => {
    const stages: ExerciseStage[] = ['start', 'stop', 'continue'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };

  useEffect(() => {
    if (exerciseId) {
      const getCards = async () => {
        const data = await getTeamExerciseData(exerciseId);
        setCards(data);
      };
      getCards();
    }
  }, [exerciseId, getTeamExerciseData, stage]);

  useEffect(() => {
    if (cards.length === 0 && teamExerciseData.length > 0) {
      const nextStage = getNextStage(stage);
      if (nextStage) {
        const params = new URLSearchParams(searchParams);
        params.set('stage', nextStage);
        router.push(`?${params.toString()}`);
      } else {
        router.push(`?id=${exerciseId}`);
      }
    }
  }, [cards, stage, router, searchParams, teamExerciseData.length, exerciseId]);

  return (
    <section className="flex flex-col items-center w-full min-h-svh h-svh pt-4 pb-6">
      <div className="flex flex-col items-center w-full flex-1 ">
        <SSCButtons disableClick={true} />
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden px-4">
          <AnimatePresence>
            {cards.map((entry: TeamExerciseData) => (
              <SwipeCard
                key={entry.id}
                title={t(`chapters.${stage}`)}
                type={stage as ExerciseStage}
                onAgree={() => handleExerciseVote(entry.id, stage, 'yes')}
                onDisagree={() => handleExerciseVote(entry.id, stage, 'no')}>
                {(Object.keys(entry.data) as ExerciseStage[])
                  .filter((key) => key === stage)
                  .map((category) => (
                    <div className="gap-8 flex flex-col " key={category}>
                      <h3 className="text-xl font-bold">{entry.author_name}</h3>
                      <h3 className="text-xl  break-words">{entry.data[category].value}</h3>
                    </div>
                  ))}
              </SwipeCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-lg px-4">
        <Button variant="red" onClick={() => handleExerciseVote(cards[0].id, stage, 'no')}>
          Disagree <X />
        </Button>
        <Button variant="green" onClick={() => handleExerciseVote(cards[0].id, stage, 'yes')}>
          Agree <Check />
        </Button>
      </div>
    </section>
  );
};
