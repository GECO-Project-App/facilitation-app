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
      <div>
        <Link href="/">
        <Home size={24} />
        </Link>
      </div>
      <div>
        <Link href={!user ? '/user' : '/user/profile'}>
          <LogIn size={24} />
        </Link>
      </div>
      <div>
        <Settings size={24} />
      </div>
      <div>
        <ListTodo size={24} />
      </div>
    </div>
  );
};

export default AppBar;
