import {useEffect, useState} from 'react';

export const useSSCChaptersHandler = () => {
  const isLocalStorageAvailable = () => typeof window !== 'undefined' && window.localStorage;

  const setChapterDone = (chapter: string) => {
    if (isLocalStorageAvailable()) {
      const completedChapters = JSON.parse(localStorage.getItem('chapterDone') || '[]');
      if (!completedChapters.includes(chapter)) {
        completedChapters.push(chapter);
        localStorage.setItem('chapterDone', JSON.stringify(completedChapters));
      }
    }
  };

  const isSSCCompleted = () => {
    if (isLocalStorageAvailable()) {
      const storedValue = localStorage.getItem('chapterDone') || '[]';
      const chaptersDone: string[] = JSON.parse(storedValue);
      return chaptersDone.length === 3;
    }
    return false;
  };

  const removeLocalStorageItem = (item: string) => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(item);
    }
  };

  // Tutorial to me review

  const [reviewDone, setReviewDone] = useState<string[]>([]);

  useEffect(() => {
    if (isLocalStorageAvailable()) {
      const storedValue = localStorage.getItem('reviewDone') || '[]';
      setReviewDone(JSON.parse(storedValue));
    }
  }, []);

  const setThisReviewDone = (chapter: string) => {
    if (isLocalStorageAvailable()) {
      const completedChapters = JSON.parse(localStorage.getItem('reviewDone') || '[]');
      if (!completedChapters.includes(chapter)) {
        completedChapters.push(chapter);
        localStorage.setItem('reviewDone', JSON.stringify(completedChapters));
      }
    }
  };

  const allReviewsDone = () => {
    if (isLocalStorageAvailable()) {
      const storedValue = localStorage.getItem('reviewDone') || '[]';
      const chaptersDone: string[] = JSON.parse(storedValue);
      return chaptersDone.length === 3;
    }
    return false;
  };

  return {
    setChapterDone,
    isSSCCompleted,
    removeLocalStorageItem,
    setThisReviewDone,
    reviewDone,
    allReviewsDone,
  };
};
