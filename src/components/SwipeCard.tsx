'use client';
import {motion, PanInfo, useAnimationControls, useMotionValue, useTransform} from 'framer-motion';
import {Card, CardContent, CardTitle} from './ui';

import {TeamExerciseData} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle} from 'react';
import {CardHeader} from './ui';

export type SwipeCardHandle = {
  swipeLeft: () => Promise<void>;
  swipeRight: () => Promise<void>;
};

type SwipeCardProps = {
  children: React.ReactNode;
  title: string;
  onAgree: () => void;
  onDisagree: () => void;
  setCards: Dispatch<SetStateAction<TeamExerciseData[]>>;
  type?: 'start' | 'stop' | 'continue';
};

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  ({children, title, onAgree, onDisagree, type = 'start'}, ref) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-30, 30]);
    const controls = useAnimationControls();

    useEffect(() => {
      const resetCard = async () => {
        await controls.start({
          x: 0,
          rotate: 0,
          transition: {type: 'spring', stiffness: 300, damping: 20},
        });
        x.set(0);
      };
      resetCard();
    }, [type, controls, x]);

    const swipeRight = async () => {
      await controls.start({
        x: 300,
        rotate: 30,
        opacity: 0,
      });
      onAgree();
    };

    const swipeLeft = async () => {
      await controls.start({
        x: -300,
        rotate: -30,
        opacity: 0,
      });
      onDisagree();
    };

    const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 300) {
        await swipeRight();
      } else if (info.offset.x < -300) {
        await swipeLeft();
      }
    };

    useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
    }));

    return (
      <motion.div
        animate={controls}
        className={cn(
          'absolute h-[90%] w-[90%] max-w-[350px] max-h-[600px] flex flex-col cursor-grab active:cursor-grabbing rounded-4xl',
        )}
        drag="x"
        style={{
          x,
          rotate,
        }}
        dragConstraints={{
          left: -100,
          right: 100,
        }}
        dragTransition={{bounceStiffness: 600, bounceDamping: 20}}
        onDragEnd={handleDragEnd}>
        <Card
          className={cn(
            type === 'start' ? 'bg-yellow' : type === 'stop' ? 'bg-red' : 'bg-green',
            'relative flex-grow',
          )}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>

          <CardContent>{children}</CardContent>
        </Card>
      </motion.div>
    );
  },
);

SwipeCard.displayName = 'SwipeCard';
