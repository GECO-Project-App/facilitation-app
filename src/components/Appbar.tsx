'use client';
import React from 'react';
import {Setting} from '@/components/icons/setting';
import {Link} from '@/navigation';
import { useUserStore } from "@/store/userStore";

const AppBar: React.FC = () => {
  const { user } = useUserStore();

  return (
    <div className="sticky top-0 flex h-[40px] w-full items-center justify-between border-b-2 border-black bg-yellow p-4">
      <div>
        <Link href={!user ? '/user' : '/user/profile'}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </div>
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white"></h1>
      </div>
      <div>
        <Link href={'#'}>
          <Setting />
        </Link>
      </div>
    </div>
  );
};

export default AppBar;
