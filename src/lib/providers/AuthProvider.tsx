'use client';

import {useUserStore} from '@/store/userStore';
import {useEffect} from 'react';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const {initialize, initialized} = useUserStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return <>{children}</>;
}
