'use client';
import {motion, PanInfo, useMotionValue, useTransform} from 'framer-motion';
import {Card, CardContent, CardTitle} from './ui';

import {cn} from '@/lib/utils';
import {CardHeader} from './ui';

type SwipeCardProps = {
  children: React.ReactNode;
  title: string;
  onAgree: () => void;
  onDisagree: () => void;
  type?: 'start' | 'stop' | 'continue';
  forceSwipe: number;
};

export const SwipeCard = ({
  children,
  title,
  onAgree,
  onDisagree,
  type = 'start',
  forceSwipe,
}: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onAgree();
    } else if (info.offset.x < -100) {
      onDisagree();
    }
  };

  return (
    <motion.div
      className={cn(
        'absolute h-auto aspect-[9/16] w-11/12 flex-1 flex flex-col cursor-grab active:cursor-grabbing rounded-4xl',
      )}
      drag="x"
      style={{
        x,
        rotate,
      }}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      initial={{
        scale: 1,
      }}
      exit={{
        x: forceSwipe === 1 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        transition: {duration: 1},
      }}
      dragTransition={{bounceStiffness: 600, bounceDamping: 20}}
      onDragEnd={handleDragEnd}>
      <Card
        className={cn(
          type === 'start' ? 'bg-yellow' : type === 'stop' ? 'bg-red' : 'bg-green',
          'flex-1',
        )}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};
