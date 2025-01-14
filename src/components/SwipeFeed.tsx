import {cn} from '@/lib/utils';
import {FC} from 'react';
import {RiveAnimation} from './RiveAnimation';

export const SwipeFeed: FC<{backgroundColor?: string}> = ({backgroundColor = 'bg-yellow'}) => {
  return (
    <div
      className={cn(
        'h-svh w-full overflow-y-scroll snap-mandatory snap-y relative',
        backgroundColor,
      )}>
      <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold">Strengths</h2>
      <div className="w-full h-svh snap-start snap-always flex flex-col items-center justify-center">
        <RiveAnimation src="swipe_up.riv" height={160} width={160} />
        <h3>to read the cards</h3>
      </div>
      {Array.from({length: 10}).map((_, index) => (
        <div
          key={index}
          className="w-full h-svh snap-start snap-always flex items-center justify-center">
          <div className="gap-24 flex flex-col w-full">
            <h3 className="text-2xl font-bold">Name</h3>
            <h3 className="text-2xl">Hello {index}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};