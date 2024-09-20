'use client';
import {ShapeColors} from '@/lib/constants';
import {ccMock} from '@/lib/mock';
import {generateRandomNumberInRange, getRandomUniqueItem} from '@/lib/utils';
import {FC, SVGProps, useEffect, useMemo, useState} from 'react';
import {PolygonAlt2, PolygonAlt3, Rounded, Star, StarAlt2} from '../icons/shapes';

const QuestionShapes = [Rounded, Star, StarAlt2, PolygonAlt2, PolygonAlt3];

type RandomQuestionProps = {
  items?: string[];
  shapes?: FC<SVGProps<SVGSVGElement>>[];
  excludeShapeColor?: string;
};

export const RandomQuestion: FC<RandomQuestionProps> = ({
  shapes = QuestionShapes,
  items = ccMock.checkIn.questions,
  excludeShapeColor,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);

  useEffect(() => {
    if (!items || !shapes) {
      return;
    }
    const savedQuestion = localStorage.getItem('currentQuestion');
    if (savedQuestion) {
      setCurrentQuestion(savedQuestion);
      setCurrentShapeIdx(parseInt(localStorage.getItem('currentShapeIdx') || '0'));
    } else {
      getNextQuestion();
    }
  }, []);

  const CurrentShape = useMemo(
    () => shapes[currentShapeIdx],
    [currentShapeIdx, shapes, excludeShapeColor],
  );

  const getNextQuestion = () => {
    let previousPicks: string[] = JSON.parse(localStorage.getItem('previousPicks') || '[]');

    const nextQuestion = getRandomUniqueItem(items, previousPicks);
    const nextShapeIdx = (currentShapeIdx + 1) % shapes.length;

    if (nextQuestion) {
      previousPicks.push(nextQuestion);
      localStorage.setItem('previousPicks', JSON.stringify(previousPicks));
      localStorage.setItem('currentQuestion', nextQuestion);
      localStorage.setItem('currentShapeIdx', nextShapeIdx.toString());
      setCurrentQuestion(nextQuestion);
      setCurrentShapeIdx(nextShapeIdx);
    } else {
      // All questions have been used, reset previousPicks
      localStorage.setItem('previousPicks', '[]');
      const question = getRandomUniqueItem(items, []);
      if (!question) {
        return;
      }
      localStorage.setItem('currentQuestion', question);
      localStorage.setItem('currentShapeIdx', '0');
      setCurrentQuestion(question);
      setCurrentShapeIdx(0);
    }
  };

  const getRandomShapeColor = (colors: {[key: string]: string}, exclude?: string): string => {
    const colorKeys = Object.values(colors).filter((color) => color !== exclude);

    const randomIndex = generateRandomNumberInRange(colorKeys.length);

    return colorKeys[randomIndex];
  };

  return (
    <div onClick={getNextQuestion} className="w-fit">
      <CurrentShape fill={getRandomShapeColor(ShapeColors, excludeShapeColor)}>
        {currentQuestion}
      </CurrentShape>
    </div>
  );
};
