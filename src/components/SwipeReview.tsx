'use client';

import {ExerciseData, TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const {exercise, getTeamExerciseData, teamExerciseData} = useExerciseStore();
  const [forceSwipe, setForceSwipe] = useState<number>(0);
  const [cards, setCards] = useState<TeamExerciseData>(teamExerciseData);
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id') as string;
  useEffect(() => {
    if (exerciseId) {
      getTeamExerciseData(exerciseId);
    }
  }, [exerciseId, getTeamExerciseData]);

  const removeCard = (id: number) => {
    setCards((prevCards: TeamExerciseData) =>
      prevCards.filter((card: TeamExerciseData) => card.id !== id),
    );
  };

  const handleAgree = (id: number) => {
    if (forceSwipe === 0) {
      return;
    }
    setForceSwipe(1);
    removeCard(id);
  };

  const handleDisagree = (id: number) => {
    if (forceSwipe === 0) {
      return;
    }
    setForceSwipe(-1);
    removeCard(id);
  };

  return (
    <PageLayout
      backgroundColor="bg-pink"
      header={<Header rightContent={<DateBadge date={exercise?.deadline.reviewingPhase} />} />}
      footer={
        <div className="flex justify-between items-center w-full h-full max-w-lg px-4">
          <Button
            variant="red"
            onClick={() => handleDisagree(cards.length > 0 ? cards[cards.length - 1]?.id : 0)}>
            Disagree <X />
          </Button>
          <Button
            variant="green"
            onClick={() => handleAgree(cards.length > 0 ? cards[cards.length - 1]?.id : 0)}>
            Agree <Check />
          </Button>
        </div>
      }>
      <div className="relative flex flex-col justify-center items-center w-full">
        <AnimatePresence>
          {cards &&
            cards.map((card: ExerciseData, index: number) => (
              <SwipeCard
                key={card.id}
                title={'test'}
                onAgree={() => handleAgree(card.id)}
                onDisagree={() => handleDisagree(card.id)}
                forceSwipe={forceSwipe}>
                <div className="gap-8 flex flex-col w-full  ">
                  <h3 className="text-2xl font-bold break-words">{card.author_name}</h3>
                  <h3 className="text-2xl break-words">{card.data['start']}</h3>
                </div>
              </SwipeCard>
            ))}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};
