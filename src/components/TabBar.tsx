'use client';
import {Link} from '@/navigation';
import {useUserStore} from '@/store/userStore';
import {usePathname} from 'next/navigation';
import {FC} from 'react';

import {Home, Library, ListTodo, Settings, Users} from 'lucide-react';

export const TabBar: FC = () => {
  const pathname = usePathname();
  const {user} = useUserStore();

  const colorText = (path: string) => {
    if (pathname.includes(path)) {
      return 'text-green';
    } else {
      return 'text-black';
    }
  };

  return (
    <nav className="fixed bottom-0 h-[40px] border-t-2 border-black bg-yellow w-full">
      <ul className="flex flex-row items-center justify-between max-w-md mx-auto h-full px-4 sm:px-0">
        <li>
          <Link href={!user ? '/user' : '/user/profile'}>
            <ListTodo
              size={24}
              className={
                pathname.split('/').pop() === 'user' || pathname.split('/').pop() === 'profile'
                  ? 'text-green'
                  : 'text-black'
              }
            />
          </Link>
        </li>
        <li>
          <Library size={24} className={colorText('library')} />
        </li>
        <li>
          <Link href="/">
            <Home
              size={24}
              className={
                pathname.split('/').pop() === 'en' || pathname.split('/').pop() === 'sv'
                  ? 'text-green'
                  : 'text-black'
              }
            />
          </Link>
        </li>
        <li>
          <Users
            size={24}
            className={pathname.split('/').pop() === 'team' ? 'text-green' : 'text-black'}
          />
        </li>
        <li>
          <Settings
            size={24}
            className={pathname.split('/').pop() === 'settings' ? 'text-green' : 'text-black'}
          />
        </li>
      </ul>
    </nav>
  );
};
