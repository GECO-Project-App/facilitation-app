'use client';
import React from 'react';
import {Setting} from '@/components/icons/setting';
import {Link} from '@/navigation';

const AppBar: React.FC = () => {
  return (
    <div className="sticky top-0 flex h-[40px] w-full items-center justify-between border-b-2 border-black bg-yellow p-4">
      <div>
        <h1 className="text-2xl font-bold text-white"></h1>
      </div>
      <div>
        <Link href={'/log-in'}>
            <Setting />
        </Link>
      </div>
    </div>
  );
};

export default AppBar;
