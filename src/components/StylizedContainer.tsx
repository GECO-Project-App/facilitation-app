import {cn} from '@/lib/utils';
import React, {FC} from 'react';

export const StylizedContainer: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        className,
        'relative flex flex-row items-center gap-2 rounded-full border-2 border-black px-6 py-2 text-xl font-bold uppercase',
      )}>
      {children}
      <div className="absolute inset-0 -z-10 translate-x-0 translate-y-2 transform rounded-full border-2 border-black bg-black" />
    </div>
  );
};
