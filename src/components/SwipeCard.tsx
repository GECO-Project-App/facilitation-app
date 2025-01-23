'use client';
import {motion, PanInfo, useAnimationControls, useMotionValue, useTransform} from 'framer-motion';
import {Card, CardContent, CardTitle} from './ui';

import {cn} from '@/lib/utils';
import {useEffect} from 'react';
import {CardHeader} from './ui';

type SwipeCardProps = {
  children: React.ReactNode;
  title: string;
  onAgree: () => void;
  onDisagree: () => void;
  type?: 'start' | 'stop' | 'continue';

  resetCard?: () => Promise<void>;
};

export const SwipeCard = ({
  children,
  title,
  onAgree,
  onDisagree,
  type = 'start',

  resetCard,
}: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const controls = useAnimationControls();

  resetCard = async () => {
    await controls.start({
      x: 0,
      rotate: 0,
      transition: {type: 'spring', stiffness: 300, damping: 20},
      opacity: 1,
    });
    x.set(0);
  };

  onAgree = async () => {
    console.log('onAgree');
    await controls.start({
      x: 300,
      rotate: 30,
      opacity: 0,
      transition: {duration: 0.5},
    });
  };

  onDisagree = async () => {
    await controls.start({
      x: -300,
      rotate: -30,
      opacity: 0,
      transition: {duration: 0.5},
    });
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onAgree();
    } else if (info.offset.x < -100) {
      onDisagree();
    }
  };

  useEffect(() => {
    resetCard();
  }, [type, resetCard]);

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
};
