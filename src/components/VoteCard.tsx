import {cn} from '@/lib/utils';
import React from 'react';
import {Card, CardContent} from './ui/card';

export const VoteCard = ({
  children,
  type = 'start',
}: {
  children: React.ReactNode;
  type?: 'start' | 'stop' | 'continue';
}) => {
  return (
    <Card
      className={cn(
        type === 'start'
          ? 'bg-yellow-deactivated'
          : type === 'stop'
            ? 'bg-red-deactivated'
            : 'bg-green-deactivated',
        'h-fit min-h-32 flex flex-col justify-center items-center relative ',
      )}>
      <div className="absolute -top-4 left-0 w-full flex flex-row justify-center items-center gap-4 ">
        <div className="border-2 border-black bg-red rounded-4xl px-3 py-1 text-xl font-bold ">
          -1
        </div>
        <div className="border-2 border-black bg-green rounded-4xl px-3 py-1 text-xl font-bold ">
          +13
        </div>
      </div>

      <CardContent className="!pt-8 relative">{children}</CardContent>
    </Card>
  );
};
