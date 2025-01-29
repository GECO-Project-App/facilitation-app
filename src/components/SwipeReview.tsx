'use client';

import {toast} from '@/hooks/useToast';
import {ExerciseStage, FormattedReview} from '@/lib/types';
import {extractReviews} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {useLocalStore} from '@/store/localStore';
import {AnimatePresence} from 'framer-motion';
import {Check, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {RiveAnimation} from './RiveAnimation';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

export const SwipeReview: FC = () => {
  const {getTeamExerciseData, handleExerciseVote, setExerciseDataAsReviewed} = useExerciseStore();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id') as string;
  const [cards, setCards] = useState<FormattedReview[]>([]);
  const t = useTranslations('exercises.ssc');
  const t2 = useTranslations('common');

  const {reviewedCards, addReviewedCard, setReviewedCards} = useLocalStore();

  useEffect(() => {
    const getCards = async () => {
      if (exerciseId) {
        const data = await getTeamExerciseData(exerciseId);

        const reviews = extractReviews(data);
        const unreviewed = reviews.filter(
          (review: FormattedReview) => !reviewedCards.includes(`${review.category}-${review.id}`),
        );
        setCards(unreviewed);
      }
    };
    getCards();
  }, [exerciseId, getTeamExerciseData, reviewedCards]);

  const handleSwipe = async (agree: boolean) => {
    const currentCard = cards[0];

    // Handle the vote
    await handleExerciseVote(
      currentCard.id,
      currentCard.category as ExerciseStage,
      agree ? 'yes' : 'no',
    );

    // Update local storage
    addReviewedCard(`${currentCard.category}-${currentCard.id}`);

    // Remove the card from the stack

    if (cards.length === 1) {
      console.log('No cards left');
      const reviewedExercise = setExerciseDataAsReviewed(exerciseId);
      if (reviewedExercise) {
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
      setReviewedCards([]);
    } else {
      setCards((prev) => prev.filter((card) => card.id !== currentCard.id));
    }
  };

  return (
    <section className="flex flex-col items-center w-full min-h-svh h-svh pt-4 pb-6">
      <div className="flex flex-col items-center w-full flex-1 ">
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden px-4">
          <AnimatePresence>
            {cards.map((card, index) => (
              <SwipeCard
                key={card.value}
                index={index}
                title={t(`chapters.${card.category}`)}
                type={card.category as ExerciseStage}
                onAgree={() => handleSwipe(true)}
                onDisagree={() => handleSwipe(false)}>
                <div className="gap-8 flex flex-col ">
                  <h3 className="text-xl font-bold">{card.author_name}</h3>
                  <h3 className="text-xl break-words">{card.value}</h3>
                </div>
              </SwipeCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-lg px-4">
        <Button variant="red" onClick={() => handleSwipe(false)}>
          Disagree <X />
        </Button>
        <Button variant="green" onClick={() => handleSwipe(true)}>
          Agree <Check />
        </Button>
      </div>
    </section>
  );
};
