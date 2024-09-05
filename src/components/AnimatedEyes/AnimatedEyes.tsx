'use client';
import React, {useState, useEffect} from 'react';
import {EyesDown, EyesRight, EyesLeft, EyesDownSlanted} from '../icons';
import {cn} from '@/lib/utils';

const eyeComponents = [EyesDown, EyesDownSlanted, EyesLeft, EyesRight];

export const AnimatedEyes: React.FC<React.SVGProps<SVGSVGElement>> = ({className, ...props}) => {
  const [currentEyeIndex, setCurrentEyeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEyeIndex((prevIndex) => (prevIndex + 1) % eyeComponents.length);
    }, 4000); // Set to switching every 4 second

    return () => clearInterval(interval);
  }, []);

  const CurrentEye = eyeComponents[currentEyeIndex];

  return (
    <div className={cn(className, 'relative transition-opacity duration-500 ease-in-out')}>
      <CurrentEye {...props} className="opacity-100" />
    </div>
  );
};
