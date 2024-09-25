'use client';

import React, {useEffect} from 'react';
import useRemoveLocalStorageItem from '@/hooks/useRemoveLocalStorageItem'; // Adjust path as needed

const ClearLocalStorage = () => {
  const removeItem = useRemoveLocalStorageItem('chapterDone');

  useEffect(() => {
    removeItem();
  }, [removeItem]);

  return null;
};

export default ClearLocalStorage;
