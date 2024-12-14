'use client';
import {motion, useMotionValue, useTransform} from 'framer-motion';
import {Card, CardContent, CardTitle} from './ui';

import {CardHeader} from './ui';

export const SwipeReview = () => {
  const x = useMotionValue(0);

  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  return (
    <div className="flex-grow flex flex-col">
      <motion.div
        className="flex-grow flex flex-col hover:cursor-grab active:cursor-grabbing"
        style={{x, opacity}}
        drag={'x'}
        dragConstraints={{
          left: 0,
          right: 0,
        }}>
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>hej</CardTitle>
          </CardHeader>

          <CardContent>
            <p>hej</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
