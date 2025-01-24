'use client';

import {TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useRef, useState} from 'react';
import {SSCButtons} from './SSCButtons';
import {SwipeCard, SwipeCardHandle} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const activeCardRef = useRef<SwipeCardHandle>(null);
  const {exercise, getTeamExerciseData, teamExerciseData} = useExerciseStore();
  const [cards, setCards] = useState<TeamExerciseData[]>(teamExerciseData);
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id') as string;
  const stage = searchParams.get('stage') as 'start' | 'stop' | 'continue';

  useEffect(() => {
    if (exerciseId) {
      getTeamExerciseData(exerciseId);
    }
  }, [exerciseId, getTeamExerciseData]);

  // useEffect(() => {
  //   if (stage) {
  //     setCards(teamExerciseData.data);
  //   }
  // }, [stage, teamExerciseData]);

  const removeCard = () => {
    setCards((prevCards) => prevCards.slice(0, -1));
  };

  return (
    <section className="flex flex-col items-center w-full min-h-svh h-svh pt-4 pb-6">
      <div className="flex flex-col items-center w-full flex-1 space-y-4">
        <SSCButtons />
        <div className="relative flex-1 flex items-center justify-center  w-full overflow-hidden">
          <AnimatePresence>
            {cards &&
              cards.map((card: TeamExerciseData, index: number) => (
                <SwipeCard
                  ref={activeCardRef}
                  key={card.id}
                  title={card.author_name}
                  onAgree={removeCard}
                  onDisagree={removeCard}
                  type={stage}>
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
        <Button variant="red" onClick={() => removeCard()}>
          Disagree <X />
        </Button>
        <Button variant="green" onClick={() => removeCard()}>
          Agree <Check />
        </Button>
      </div>
    </section>
  );
};
