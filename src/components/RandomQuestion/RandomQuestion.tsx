'use client';

import {PolygonAlt2, PolygonAlt3, Rounded, Star, StarAlt2} from '@/components/icons/shapes';
import {motion} from 'framer-motion';
import {useCallback, useEffect, useState} from 'react';

const shapes = [Rounded, Star, StarAlt2, PolygonAlt2, PolygonAlt3];

export const RandomQuestion = ({questions}: {questions: string[]}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [displayedQuestion, setDisplayedQuestion] = useState<string | null>(null);

  const shuffleShape = useCallback(() => {
    setCurrentShapeIndex((prevIndex) => (prevIndex + 1) % shapes.length);
    setDisplayedQuestion(() => questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isSpinning) {
      intervalId = setInterval(shuffleShape, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSpinning, shuffleShape]);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setDisplayedQuestion(null);
    const newRotation = rotation + 1440 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      const selectedIndex = Math.floor((newRotation % 360) / (360 / questions.length));
      setIsSpinning(false);
    }, 5000);
  };

  const CurrentShape = shapes[currentShapeIndex];

  return (
    <button
      className="aspect-square w-full overflow-hidden"
      onClick={spinWheel}
      type="button"
      disabled={isSpinning}>
      <motion.div
        className="relative h-full w-full"
        animate={{rotate: rotation}}
        transition={{duration: 5, ease: 'easeOut'}}>
        <CurrentShape className="fill-blue-500 stroke-blue-600 h-full w-full" />
      </motion.div>
      <h4 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center font-bold">
        {displayedQuestion ?? 'Press to get a new question!'}
      </h4>
    </button>
  );
};
