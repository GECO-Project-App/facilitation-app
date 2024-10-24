'use client';

import {useEffect} from 'react';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';

const ClearLocalStorage = () => {
  const {removeLocalStorageItem} = useSSCChaptersHandler();

  useEffect(() => {
    removeLocalStorageItem();
  }, []);

  return null;
};

export default ClearLocalStorage;
