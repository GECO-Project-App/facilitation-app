import {useEffect, useState} from 'react';

interface UseKeyboardStatusResult {
  isKeyboardOpen: boolean;
}

export const useKeyboardStatus = (): UseKeyboardStatusResult => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialHeight, setInitialHeight] = useState<number>(0);

  useEffect(() => {
    // Use visualViewport if available, otherwise fallback to window.innerHeight
    const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

    const handleResize = () => {
      const currentHeight = getViewportHeight();
      // Compare current height with initial height to determine if the keyboard is open
      if (initialHeight > 0 && currentHeight < initialHeight) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    // Set the initial height when the component mounts
    setInitialHeight(getViewportHeight());

    // Listen to resize events
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      // Cleanup the event listener
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [initialHeight]);

  return {isKeyboardOpen};
};
