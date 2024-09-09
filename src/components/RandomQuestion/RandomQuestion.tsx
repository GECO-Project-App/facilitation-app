'use client';
import {ShapeColors} from '@/lib/constants';
import {mockQuestions} from '@/lib/mock';
import {getRandomColor, getRandomUniqueItem} from '@/lib/utils';
import {FC, SVGProps, useEffect, useMemo, useState} from 'react';
import {Star, StarAlt3, StarAlt4, Triangle} from '../icons/shapes';

const QuestionShapes = [Triangle, Star, StarAlt3, StarAlt4];

type RandomQuestionProps = {
  items?: string[];
  shapes?: FC<SVGProps<SVGSVGElement>>[];
  defaultColor?: string;
};

export const RandomQuestion: FC<RandomQuestionProps> = ({
  shapes = QuestionShapes,
  items = mockQuestions,
  defaultColor,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);

  useEffect(() => {
    if (!items || !shapes) {
      return;
    }
    getNextQuestion();
  }, []);

  const CurrentShape = useMemo(() => shapes[currentShapeIdx], [currentShapeIdx, shapes]);

  let previousPicks: (typeof items)[number][] = [];

  const getNextQuestion = () => {
    const nextQuestion = getRandomUniqueItem(items, previousPicks);
    setCurrentShapeIdx((prevIndex) => (prevIndex + 1) % shapes.length);

    if (nextQuestion) {
      previousPicks.push(nextQuestion);

      setCurrentQuestion(nextQuestion);
    } else {
      // All questions have been used, reset previousPicks
      previousPicks = [];
      const question = getRandomUniqueItem(items, previousPicks);
      if (!question) {
        return;
      }
      setCurrentQuestion(question);
    }
  };

  return (
    <div onClick={getNextQuestion}>
      <CurrentShape fill={defaultColor ?? getRandomColor(ShapeColors)}>
        {currentQuestion}
      </CurrentShape>
    </div>
  );
};
