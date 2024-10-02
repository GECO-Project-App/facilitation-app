import {cn} from '@/lib/utils';
import React, {FC} from 'react';

export const PageLayout: FC<{
  children: React.ReactNode;
  backgroundColor?: string;
  hasPadding?: boolean;
}> = ({children, backgroundColor = 'bg-white', hasPadding = true}) => {
  return (
    <main className={cn(backgroundColor, 'min-h-svh')}>
      <section
        className={cn(
          hasPadding ? 'page-padding' : '',
          'page-constraints flex min-h-svh flex-col justify-between space-y-4',
        )}>
        {children}
      </section>
    </main>
  );
};
