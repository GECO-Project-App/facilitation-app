'use client';

import {TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {SSCButtons} from './SSCButtons';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const {exercise, getTeamExerciseData, teamExerciseData} = useExerciseStore();
  const [forceSwipe, setForceSwipe] = useState<number>(0);
  const [cards, setCards] = useState<TeamExerciseData[]>(teamExerciseData);
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id') as string;
  const stage = searchParams.get('stage') as 'start' | 'stop' | 'continue';

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
    <section className="flex flex-col items-center w-full min-h-svh h-svh pt-4 pb-6">
      <div className="flex flex-col items-center w-full flex-1 space-y-4">
        <SSCButtons />
        <div className="relative flex-1 flex items-center justify-center  w-full max-w-lg">
          <AnimatePresence>
            {cards &&
              cards.map((card: TeamExerciseData, index: number) => (
                <SwipeCard
                  key={card.id}
                  title={'Review'}
                  onAgree={() => handleAgree(card.id)}
                  onDisagree={() => handleDisagree(card.id)}
                  type={stage ?? 'start'}>
                  <div className="gap-8 flex flex-col w-full">
                    <h3 className="text-xl font-bold break-words">{card.author_name}</h3>
                    <h3 className="text-xl break-words">{card.data[stage ?? 'start']}</h3>
                  </div>
                </SwipeCard>
              ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-lg px-4">
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
    </section>
  );
};
