'use client';
import {mockQuestions} from '@/lib/mock';
import {getRandomUniqueItem} from '@/lib/utils';
import {FC, SVGProps, useEffect, useMemo, useState} from 'react';
import {Rounded, Star, StarAlt2, Polygon, PolygonAlt2, PolygonAlt3} from '../icons/shapes';

const QuestionShapes = [Rounded, Star, StarAlt2, Polygon, PolygonAlt2, PolygonAlt3];

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
    <div onClick={getNextQuestion} className="w-fit">
      <CurrentShape>{currentQuestion}</CurrentShape>
    </div>
  );
};
