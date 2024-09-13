'use client';

import React, { useEffect } from 'react';
import useRemoveLocalStorageItem from '@/hooks/useRemoveLocalStorageItem'; // Adjust path as needed

const ClearLockalStorage = () => {
  const removeItem = useRemoveLocalStorageItem('chapterDone');

  useEffect(() => {
    removeItem();
  }, [removeItem]);

  return null;
};

export default ClearLockalStorage;
