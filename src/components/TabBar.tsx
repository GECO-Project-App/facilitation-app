'use client';
import {locales} from '@/i18n/config';
import {Link} from '@/i18n/routing';
import {Home, Library, ListTodo, Settings, Users} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {FC} from 'react';

export const TabBar: FC = () => {
  const pathname = usePathname();

  const colorText = (path: string) => {
    if (pathname.includes(path)) {
      return 'text-green';
    } else {
      return 'text-black';
    }
  };

  return (
    <nav className="fixed bottom-0  border-t-2 border-black bg-yellow w-full">
      <ul className="flex flex-row items-center justify-between max-w-md mx-auto h-full p-4 sm:pb-8">
        <li>
          <ListTodo size={24} className={colorText('activities')} />
        </li>
        <li>
          <Library size={24} className={colorText('library')} />
        </li>
        <li>
          <Link href="/">
            <Home
              size={24}
              className={
                locales.includes(pathname.split('/').pop() || '') ? 'text-green' : 'text-black'
              }
            />
          </Link>
        </li>
        <li>
          <Link href="/team">
            <Users size={24} className={colorText('team')} />
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <Settings size={24} className={colorText('settings')} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
