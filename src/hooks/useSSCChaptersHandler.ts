import {useEffect, useState} from 'react';
export const useSSCChaptersHandler = () => {
  //
  const setChapterDone = (chapter: string) => {
    const completedChapters = JSON.parse(localStorage.getItem('chapterDone') || '[]');
    if (!completedChapters.includes(chapter)) {
      completedChapters.push(chapter);
      localStorage.setItem('chapterDone', JSON.stringify(completedChapters));
    }
    //
  };

  const isSSCCompleted = () => {
    const storedValue = localStorage.getItem('chapterDone') || '[]';
    const chaptersDone: string[] = JSON.parse(storedValue);
    return chaptersDone.length === 3;
  };
  //

  const removeLocalStorageItem = (item: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(item);
    }
  };

  //Tutorial to me review

  const [reviewDone, setReviewDone] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('reviewDone') || '[]';
      setReviewDone(JSON.parse(storedValue));
    }
  }, []);

  const setThisReviewDone = (chapter: string) => {
    const completedChapters = JSON.parse(localStorage.getItem('reviewDone') || '[]');
    if (!completedChapters.includes(chapter)) {
      completedChapters.push(chapter);
      localStorage.setItem('reviewDone', JSON.stringify(completedChapters));
    }
    //
  };

  const allReviewsDone = () => {
    const storedValue = localStorage.getItem('reviewDone') || '[]';
    const chaptersDone: string[] = JSON.parse(storedValue);
    return chaptersDone.length === 3;
  };
  //
  return {
    setChapterDone,
    isSSCCompleted,
    removeLocalStorageItem,
    setThisReviewDone,
    reviewDone,
    allReviewsDone,
  };
};
