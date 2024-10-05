'use client';
import {ShapeColors} from '@/lib/constants';
import {generateRandomNumberInRange, getRandomUniqueItem} from '@/lib/utils';
import {FC, SVGProps, useCallback, useEffect, useMemo, useState} from 'react';
import {PolygonAlt2, PolygonAlt3, Rounded, Star, StarAlt2} from '../icons/shapes';
import {RiveAnimation} from '../RiveAnimation';
import {Arrow} from '../icons';

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
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);
  const [isIntervalActive, setIsIntervalActive] = useState(true);

  const CurrentShape = useMemo(() => {
    return shapes[currentShapeIdx];
  }, [currentShapeIdx, shapes, excludeShapeColor]);

  const generateNewQuestionAndShape = useCallback(() => {
    const nextQuestion = getRandomUniqueItem(questions, []);
    const nextShapeIdx = (currentShapeIdx + 1) % shapes.length;

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setCurrentShapeIdx(nextShapeIdx);
    }
  }, [questions, currentShapeIdx, shapes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isIntervalActive) {
      interval = setInterval(() => {
        generateNewQuestionAndShape();
      }, 100);
    }
    if (!isIntervalActive) {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generateNewQuestionAndShape, isIntervalActive]);

  const handleClick = () => {
    if (currentQuestion) {
      setIsIntervalActive((prev) => !prev);
    }
  };

  const getRandomShapeColor = (colors: {[key: string]: string}, exclude?: string): string => {
    const colorKeys = Object.values(colors).filter((color) => color !== exclude);

    const randomIndex = generateRandomNumberInRange(colorKeys.length);

    return colorKeys[randomIndex];
  };

  const ReminderText: FC = useCallback(() => {
    return (
      <div className="absolute left-3/4 top-[20%] z-10 w-44 -translate-x-1/2 -translate-y-1/2 rotate-12 lg:top-1/4">
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
    <section className="relative flex w-full flex-1 flex-col items-center justify-center">
      <ReminderText />
      <button onMouseDown={handleClick} className="cursor-pointer">
        <CurrentShape fill={getRandomShapeColor(ShapeColors, excludeShapeColor)}>
          {currentQuestion}
        </CurrentShape>
      </button>
    </section>
  );
};
