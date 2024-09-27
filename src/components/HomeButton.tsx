import React, {FC} from 'react';
import {Home} from './icons';
import {Link} from '@/navigation';

export const HomeButton: FC = () => {
  return (
    <Link href="/">
      <button>
        <Home />
      </button>
    </Link>
  );
};
