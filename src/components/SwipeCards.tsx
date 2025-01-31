'use client';
import {TeamExerciseData} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {motion, useMotionValue, useTransform} from 'framer-motion';
import {useSearchParams} from 'next/navigation';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';

export const SwipeCards = () => {
  const {getTeamExerciseData} = useExerciseStore();
  const searchParams = useSearchParams();
  const stage = (searchParams.get('stage') as 'start' | 'stop' | 'continue') ?? 'start';
  const exerciseId = searchParams.get('id') as string;

  const [cards, setCards] = useState<TeamExerciseData[]>([]);

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
    <div className="grid h-full max-h-[70%] w-full place-items-center ">
      {cards.map((card) => {
        return (
          <SwipeCard key={card.id} cards={cards} setCards={setCards} {...card}>
            <div className="gap-8 flex flex-col w-full">
              <h3 className="text-xl font-bold break-words">{card.author_name}</h3>
              <h3 className="text-xl break-words">{card.data[stage ?? 'start'].value}</h3>
            </div>
          </SwipeCard>
        );
      })}
    </div>
  );
};

type SwipeCardProps = {
  children: React.ReactNode;
  id: number;
  cards: TeamExerciseData[];
  setCards: Dispatch<SetStateAction<TeamExerciseData[]>>;
  title: string;
  onAgree: () => void;
  onDisagree: () => void;
  type?: 'start' | 'stop' | 'continue';
};

const SwipeCard = ({
  id,
  cards,
  setCards,
  children,

  onAgree,
  onDisagree,
  type,
}: SwipeCardProps) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      className="h-full flex-1 flex flex-col max-w-lg w-full origin-bottom rounded-lg object-cover hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: '0.125s transform',
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}>
      <Card
        className={cn(
          type === 'start' ? 'bg-yellow' : type === 'stop' ? 'bg-red' : 'bg-green',
          'relative  h-full',
        )}>
        <CardHeader>
          <CardTitle>title</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};
