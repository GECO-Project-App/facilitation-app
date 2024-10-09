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
      intervalId = setInterval(shuffleShape, 200);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSpinning, shuffleShape]);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setDisplayedQuestion(null);
    const newRotation = rotation + 1440 + 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
    }, 3800);
  };

  const CurrentShape = shapes[currentShapeIndex];

  return (
    <motion.button
      className="aspect-square w-full"
      onClick={spinWheel}
      type="button"
      disabled={isSpinning}
      whileTap={{scale: 0.9}}
      initial={{scale: 0.8}}
      transition={{type: 'spring', stiffness: 400, damping: 17}}>
      <motion.div
        className="h-full w-full"
        animate={{rotate: rotation}}
        transition={{duration: 3.8, ease: 'easeOut'}}>
        <CurrentShape className="fill-blue-500 stroke-blue-600 h-full w-full">
          {displayedQuestion ?? 'Press to get a new question!'}
        </CurrentShape>
      </motion.div>
    </motion.button>
  );
};
