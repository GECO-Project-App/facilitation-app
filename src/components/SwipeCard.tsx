'use client';
import {motion, PanInfo, useAnimationControls, useMotionValue, useTransform} from 'framer-motion';
import {Card, CardContent, CardTitle} from './ui';

import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {forwardRef, useEffect} from 'react';
import {CardHeader} from './ui';

type SwipeCardProps = {
  children: React.ReactNode;
  title: string;
  onAgree: () => void;
  onDisagree: () => void;
  type?: ExerciseStage;
  index?: number;
};

export const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(
  ({children, title, onAgree, onDisagree, type = 'start', index = 0}, ref) => {
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

    return (
      <motion.div
        animate={controls}
        className={cn('swipe-card')}
        drag="x"
        style={{
          x,
          rotate,
          zIndex: -index,
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
            'relative flex-grow ',
          )}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>

          <CardContent className="">{children}</CardContent>
        </Card>
      </motion.div>
    );
  },
);

SwipeCard.displayName = 'SwipeCard';
