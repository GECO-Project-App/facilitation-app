'use client';

import {PolygonAlt2, PolygonAlt3, Rounded, Star, StarAlt2} from '@/components/icons/shapes';
import {AnimatePresence, motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useCallback, useEffect, useState} from 'react';
import {Arrow} from '../icons';

const shapes = [Rounded, Star, StarAlt2, PolygonAlt2, PolygonAlt3];

export const RandomQuestion = ({questions}: {questions: string[]}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [displayedQuestion, setDisplayedQuestion] = useState<string | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const t = useTranslations('common');

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
    setShowArrow(false);
    const newRotation = rotation + 1440 + 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setTimeout(() => {
        setShowArrow(true);
      }, 2000);
    }, 3800);
  };

  const CurrentShape = shapes[currentShapeIndex];

  return (
    <div className="relative">
      <motion.button
        className="aspect-square w-full"
        onClick={spinWheel}
        type="button"
        disabled={isSpinning}
        whileTap={{scale: 0.9}}
        initial={{scale: 1}}
        transition={{type: 'spring', stiffness: 400, damping: 17}}>
        <motion.div
          className="h-full w-full"
          animate={{rotate: rotation}}
          transition={{
            duration: 3.8,
            ease: 'easeOut',
          }}>
          <CurrentShape className="fill-blue-500 stroke-blue-600 h-full w-full">
            {displayedQuestion ?? 'Press to get a new question!'}
          </CurrentShape>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showArrow && (
          <div className="absolute bottom-full left-1/2 mb-4 flex -translate-x-1/2 transform items-center gap-4">
            <motion.div
              initial={{y: 30, opacity: 0}}
              animate={{y: -10, opacity: 1}}
              exit={{y: 30, opacity: 0}}
              transition={{duration: 1, delay: 0.5, type: 'spring', stiffness: 400, damping: 17}}>
              <Arrow />
            </motion.div>

            <motion.h4
              className="w-44"
              initial={{opacity: 0, y: 20, rotate: 16}}
              animate={{opacity: 1, y: -1, rotate: 16}}
              exit={{opacity: 0, y: 20, rotate: 16}}
              transition={{duration: 1, delay: 0.6, type: 'spring', stiffness: 400, damping: 17}}>
              {t('common.pressToGetNewQuestion')}
            </motion.h4>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
