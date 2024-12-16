'use client';
import {AnimatePresence} from 'framer-motion';

import {Check, X} from 'lucide-react';
import {FC, useState} from 'react';
import {PageLayout} from './PageLayout';
import {SwipeCard} from './SwipeCard';
import {Button} from './ui/button';

const mockCards = [
  {id: 1, title: 'Card 1', content: 'Content 1'},
  {id: 2, title: 'Card 2', content: 'Content 2'},
  {id: 3, title: 'Card 3', content: 'Content 3'},
  {id: 4, title: 'Card 4', content: 'Content 4'},
  {id: 5, title: 'Card 5', content: 'Content 5'},
  {id: 6, title: 'Card 6', content: 'Content 6'},
  {id: 7, title: 'Card 7', content: 'Content 7'},
  {id: 8, title: 'Card 8', content: 'Content 8'},
  {id: 9, title: 'Card 9', content: 'Content 9'},
  {id: 10, title: 'Card 10', content: 'Content 10'},
];

export const SwipeReview: FC = () => {
  const [cards, setCards] = useState<typeof mockCards>(mockCards);
  const [forceSwipe, setForceSwipe] = useState<number>(0);

  const removeCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const handleAgree = (id: number) => {
    // TODO: Increment
    setForceSwipe(1);
    removeCard(id);
  };

  const handleDisagree = (id: number) => {
    setForceSwipe(-1);
    removeCard(id);
  };

  return (
    <PageLayout
      backgroundColor="black"
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
          {cards.map((card, index) => (
            <SwipeCard
              key={card.id}
              title={card.title}
              onAgree={() => handleAgree(card.id)}
              onDisagree={() => handleDisagree(card.id)}
              forceSwipe={forceSwipe}>
              <p>{card.content}</p>
            </SwipeCard>
          ))}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};
