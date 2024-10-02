import {cn} from '@/lib/utils';
import React, {FC} from 'react';

export const PageLayout: FC<{
  children: React.ReactNode;
  backgroundColor?: string;
  hasPadding?: boolean;
}> = ({children, backgroundColor = 'bg-white', hasPadding = true}) => {
  return (
    <main className={cn(backgroundColor, 'min-h-screen')}>
      <section
        className={cn(
          hasPadding ? 'page-padding' : '',
          'page-constraints flex min-h-screen flex-col justify-between',
        )}>
        {children}
      </section>
    </main>
  );
};
