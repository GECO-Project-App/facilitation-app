'use client';

import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useEffect} from 'react';

const ClearLocalStorage = () => {
  const {removeLocalStorageItem} = useSSCChaptersHandler();

  useEffect(() => {
    removeLocalStorageItem('chapterDone');
  }, [removeLocalStorageItem]);

  return null;
};

export default ClearLocalStorage;
