'use client';

import useRemoveLocalStorageItem from '@/hooks/useRemoveLocalStorageItem'; // Adjust path as needed
import {useEffect} from 'react';

const ClearLocalStorage = () => {
  const removeItem = useRemoveLocalStorageItem('chapterDone');

  useEffect(() => {
    removeItem();
  }, [removeItem]);

  return null;
};

export default ClearLocalStorage;
