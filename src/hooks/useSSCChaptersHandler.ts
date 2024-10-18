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

  const removeLocalStorageItem = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chapterDone');
    }
  };
  return {setChapterDone, isSSCCompleted, removeLocalStorageItem};
};
