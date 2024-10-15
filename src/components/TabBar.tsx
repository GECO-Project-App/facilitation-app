'use client';
import {Link} from '@/navigation';
import {useUserStore} from '@/store/userStore';
import {Home, ListTodo, LogIn, Settings} from 'lucide-react';
import {FC} from 'react';

export const TabBar: FC = () => {
  const {user} = useUserStore();

  return (
    <div className="fixed bottom-0 flex h-[40px] w-full items-center justify-between border-t-2 border-black bg-yellow px-14">
      <span>
        <Link href="/">
          <Home size={24} />
        </Link>
      </span>
      <span>
        <Link href={!user ? '/user' : '/user/profile'}>
          <LogIn size={24} />
        </Link>
      </span>
      <span>
        <Settings size={24} />
      </span>
      <span>
        <ListTodo size={24} />
      </span>
    </div>
  );
};
