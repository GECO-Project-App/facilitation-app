'use client';
import {Link} from '@/i18n/routing';
import {Library, ListTodo, Settings, Users} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {FC} from 'react';
import {TabBarNotification} from './TabBarNotification';

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
        <li className="relative">
          <Link href="/activities">
            <ListTodo size={28} className={colorText('activities')} />
          </Link>
          <TabBarNotification showNumber={false} />
        </li>
        <li>
          <Link href="/exercise-catalogue">
            <Library size={28} className={colorText('exercise-catalogue')} />
          </Link>
        </li>

        <li>
          <Link href="/team">
            <Users size={28} className={colorText('team')} />
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <Settings size={28} className={colorText('settings')} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
