'use client';
import {Link} from '@/navigation';
import {useUserStore} from '@/store/userStore';
import {Home, LogIn} from 'lucide-react';
import {FC} from 'react';
import {Team} from './icons';

export const TabBar: FC = () => {
  const {user} = useUserStore();

  return (
    <nav className="fixed bottom-0 flex h-[40px] w-full border-t-2 border-black bg-yellow px-4">
      <ul className="flex items-center justify-between w-full bw-full gap-4">
        <li>
          <Link href="/">
            <Home size={24} />
          </Link>
        </li>
        <li>
          <Link href={!user ? '/user' : '/user/profile'}>
            <LogIn size={24} />
          </Link>
        </li>
        <li>
          <Link href="/team">
            <Team />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
