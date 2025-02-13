'use client';
import {useRouter} from '@/i18n/routing';
import {ArrowLeft} from 'lucide-react';
import React, {FC} from 'react';

type HeaderProps = {
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  onBackButton?: () => void;
  showBackButton?: boolean;
  children?: React.ReactNode;
  bottomContent?: React.ReactNode;
};

export const Header: FC<HeaderProps> = ({
  rightContent,
  onBackButton,
  children,
  leftContent,
  showBackButton = true,
  bottomContent,
}) => {
  const router = useRouter();

  return (
    <>
      <header className="page-constraints flex w-full flex-row items-center justify-between gap-2 px-4 pb-4 lg:gap-4 relative">
        <div className="flex-none aspect-square h-11">
          {leftContent ? (
            leftContent
          ) : (
            <>
              {showBackButton && (
                <button onClick={() => (onBackButton ? onBackButton() : router.back())}>
                  <ArrowLeft size={42} />
                </button>
              )}
            </>
          )}
        </div>
        <nav className="mx-auto flex grow flex-row items-center justify-center">{children}</nav>
        {rightContent ? <>{rightContent}</> : <div className="aspect-square h-11 flex-none" />}
      </header>
      {bottomContent && <div className="">{bottomContent}</div>}
    </>
  );
};
