'use client';

import {TeamExerciseData} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {SSCButtons} from './SSCButtons';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const {getTeamExerciseData} = useExerciseStore();
  const searchParams = useSearchParams();
  const stage = (searchParams.get('stage') as 'start' | 'stop' | 'continue') ?? 'start';
  const exerciseId = searchParams.get('id') as string;
  const [cards, setCards] = useState<TeamExerciseData[]>([]);
  const t = useTranslations('exercises.ssc');

  useEffect(() => {
    if (exerciseId) {
      const getCards = async () => {
        const data = await getTeamExerciseData(exerciseId);
        console.log(data);
        const noVotes = data.filter(
          (item: TeamExerciseData) =>
            item.data[stage].vote.yes === 0 || item.data[stage].vote.no === 0,
        );
        setCards(noVotes);
      };
      getCards();
    }
  }, [exerciseId, getTeamExerciseData, stage]);
  return (
    <section className="flex flex-col items-center w-full min-h-svh h-svh pt-4 pb-6">
      <div className="flex flex-col items-center w-full flex-1 ">
        <SSCButtons />
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden px-4">
          {/* <SwipeCards /> */}
          <AnimatePresence>
            {cards.map((card: TeamExerciseData, index: number) => (
              <SwipeCard
                key={card.id}
                title={t(`chapters.${stage}`)}
                onAgree={() => {}}
                onDisagree={() => {}}
                setCards={setCards}
                type={stage}>
                <div className="gap-8 flex flex-col w-full">
                  <h3 className="text-xl font-bold break-words">{card.author_name}</h3>
                  <h3 className="text-xl break-words">{card.data[stage ?? 'start'].value}</h3>
                </div>
              </SwipeCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-lg px-4">
        <Button variant="red" onClick={() => {}}>
          Disagree <X />
        </Button>
        <Button variant="green" onClick={() => {}}>
          Agree <Check />
        </Button>
      </div>
    </section>
  );
};
