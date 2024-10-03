import {useEffect, useState} from 'react';

export const useKeyboardResize = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const innerHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const heightDifference = screenHeight - innerHeight;

      if (heightDifference > 100) {
        // Keyboard is likely open
        setKeyboardHeight(heightDifference);
      } else {
        // Keyboard is closed, reset the keyboard height
        setKeyboardHeight(0);
      }
    };

    // Call `handleResize` on component mount to check if keyboard is already open
    handleResize();

    // Add the resize event listener
    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return keyboardHeight;
};
