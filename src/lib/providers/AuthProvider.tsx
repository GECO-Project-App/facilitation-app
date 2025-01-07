'use client';

import {useTeamStore} from '@/store/teamStore';
import {useUserStore} from '@/store/userStore';
import {useEffect} from 'react';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const {initialize, initialized} = useUserStore();
  const {init} = useTeamStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
      init();
    }
  }, [initialize, initialized, init]);

  return <>{children}</>;
}
