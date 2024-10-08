import {cn} from '@/lib/utils';
import React, {FC} from 'react';

export const PageLayout: FC<{
  children: React.ReactNode;
  backgroundColor?: string;
  contentColor?: string;
  hasPadding?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}> = ({
  children,
  backgroundColor = 'bg-white',
  hasPadding = true,
  header,
  footer,
  contentColor,
}) => {
  return (
    <main className={cn(backgroundColor, 'page-padding flex min-h-svh flex-col justify-between')}>
      {header}

      <section
        className={cn(
          contentColor ?? 'bg-white',
          'relative flex w-full flex-1 flex-col justify-center',
        )}>
        <div className={cn(hasPadding ? 'px-4' : '', 'page-constraints h-full w-full py-8')}>
          {children}
        </div>
      </section>
      <footer className="flex flex-row justify-center pt-4">{footer}</footer>
    </main>
  );
};
