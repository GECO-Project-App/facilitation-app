import {FC, ReactNode} from 'react';
import {BackButton} from './BackButton';

export const NavBar: FC<{children?: ReactNode}> = ({children}) => {
  return (
    <nav className="">
      <ul className="flex w-full flex-row items-center justify-between gap-2 lg:gap-4">
        <BackButton />

        <li className="flex flex-1">{children}</li>
      </ul>
    </nav>
  );
};
