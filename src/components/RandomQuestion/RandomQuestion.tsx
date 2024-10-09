'use client';
import {useInView, useMotionValue, useSpring} from 'framer-motion';
import {FC, SVGProps, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Arrow} from '../icons';
import {PolygonAlt2, PolygonAlt3, Rounded, Star, StarAlt2} from '../icons/shapes';
import {RiveAnimation} from '../RiveAnimation';

const QuestionShapes = [Rounded, Star, StarAlt2, PolygonAlt2, PolygonAlt3];

type RandomQuestionProps = {
  slug: string;
  shapes?: FC<SVGProps<SVGSVGElement>>[];
  excludeShapeColor?: string;
  questions: string[];
};

export const RandomQuestion: FC<RandomQuestionProps> = ({
  shapes = QuestionShapes,
  slug,
  excludeShapeColor,
  questions,
}) => {
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(questions.length);
  const shapeValue = useMotionValue(shapes.length);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, {once: true, margin: '-100px'});

  const CurrentShape = useMemo(() => {
    return shapes[currentShapeIdx];
  }, [currentShapeIdx, shapes, excludeShapeColor]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(questions.length);
    }
  }, [motionValue, isInView]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = questions[latest];
        }
        setCurrentShapeIdx(latest);
      }),
    [springValue],
  );

  const ReminderText: FC = useCallback(() => {
    return (
      <div className="absolute left-3/4 top-[10%] z-10 w-44 -translate-x-1/2 -translate-y-1/2 rotate-12 md:top-[20%] lg:left-[60%] xl:top-1/4">
        <div className="relative">
          <h4 className="text-left">Press to get a new question!</h4>
          <span className="absolute right-6 top-5">
            <RiveAnimation src={'eyes.riv'} width={50} height={50} />
          </span>
          <Arrow className="absolute -left-14 top-4" />
        </div>
      </div>
    );
  }, []);

  return (
    <div className="mx-auto w-fit">
      <ReminderText />
      <button className="cursor-pointer">
        <span ref={ref} className="text-black" />
      </button>
    </div>
  );
};
