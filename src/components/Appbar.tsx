'use client';
import React from 'react';
import {Link} from '@/navigation';
import {useUserStore} from '@/store/userStore';
import {Home, Settings, LogIn, ListTodo} from 'lucide-react';

const AppBar: React.FC = () => {
  const {user} = useUserStore();

  return (
    <div
      className="fixed bottom-0 flex h-[40px] w-full items-center justify-between border-t-2 border-black px-14"
      style={{backgroundColor: '#facc15'}}>
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

export default AppBar;
