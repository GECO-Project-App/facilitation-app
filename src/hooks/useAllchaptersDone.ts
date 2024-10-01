'use client';
import { useState, useEffect } from "react";

// Custom Hook to check localStorage for 'chapterDone' array
export const useAllchaptersDone = (): boolean => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("chapterDone");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const hasAll = ['start', 'stop', 'continue'].every((item) =>
            parsedData.includes(item)
          );
          setIsComplete(hasAll);
        } else {
          setIsComplete(false); // Not an array
        }
      } catch (error) {
        setIsComplete(false); // Invalid JSON
      }
    } else {
      setIsComplete(false); // No data in localStorage
    }
  }, []); // Only runs once on mount

  return isComplete;
};
