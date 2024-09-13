''
import { useCallback } from 'react';

// Custom hook to remove an item from localStorage
const useRemoveLocalStorageItem = (key: string) => {
  const removeItem = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, [key]);

  return removeItem;
};

export default useRemoveLocalStorageItem;
