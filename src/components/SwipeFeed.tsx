'use client';
import {cn} from '@/lib/utils';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
import {RiveAnimation} from './RiveAnimation';

export const SwipeFeed: FC<{backgroundColor?: string}> = ({backgroundColor = 'bg-yellow'}) => {
  const t = useTranslations('exercises.tutorialToMe.review.swipe');

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-y-scroll snap-mandatory snap-y shadow-dark rounded-4xl border-2 border-black p-6',
        backgroundColor,
      )}>
      <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-2xl font-bold">Strengths</h2>
      <div className="w-full h-full snap-start snap-always flex flex-col items-center justify-center">
        <RiveAnimation src="swipe_up.riv" height={160} width={160} />
        <h3>{t('read')}</h3>
      </div>
      {Array.from({length: 10}).map((_, index) => (
        <div
          key={index}
          className="w-full h-full snap-start snap-always flex items-center justify-center">
          <div className="gap-8 flex flex-col w-full">
            <h3 className="text-2xl font-bold">Name</h3>
            <h3 className="text-2xl">Hello {index}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
