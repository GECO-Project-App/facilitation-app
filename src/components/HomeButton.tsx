import {Link} from '@/i18n/routing';
import {FC} from 'react';
import {Home} from './icons';

export const HomeButton: FC = () => {
  return (
    <Link href="/">
      <button>
        <Home />
      </button>
    </Link>
  );
};
