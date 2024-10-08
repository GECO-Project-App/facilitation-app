'use client';
import {Link, useRouter} from '@/navigation';
import {ArrowLeft} from 'lucide-react';
import React, {FC} from 'react';

type HeaderProps = {
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  onBackButton?: () => void;
  children?: React.ReactNode;
};

export const Header: FC<HeaderProps> = ({rightContent, onBackButton, children, leftContent}) => {
  const router = useRouter();

  return (
    <header className="page-constraints flex w-full flex-row items-center justify-between gap-2 px-4 pb-4 lg:gap-4">
      <div className="flex-none">
        {leftContent ? (
          leftContent
        ) : (
          <button onClick={() => onBackButton ?? router.back()}>
            <ArrowLeft size={42} />
          </button>
        )}
      </div>
      <nav className="mx-auto flex grow flex-row items-center justify-center">{children}</nav>
      <div className="aspect-square h-11 flex-none">{rightContent}</div>
    </header>
  );
};
