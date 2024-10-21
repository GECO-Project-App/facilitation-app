'use client';
import {Link} from '@/navigation';
import {useUserStore} from '@/store/userStore';
import {Home, ListTodo, LogIn, Settings} from 'lucide-react';
import {FC} from 'react';

export const TabBar: FC = () => {
  const {user} = useUserStore();

  return (
    <nav className="fixed bottom-0 h-[40px] border-t-2 border-black bg-yellow w-full">
      <ul className="flex flex-row items-center justify-between max-w-md mx-auto h-full px-4 sm:px-0">
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
          <Settings size={24} />
        </li>
        <li>
          <ListTodo size={24} />
        </li>
      </ul>
    </nav>
  );
};
