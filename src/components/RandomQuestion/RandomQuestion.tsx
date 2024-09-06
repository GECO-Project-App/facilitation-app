'use client';
import {ShapeColors, Shapes} from '@/lib/constants';
import {mockQuestions} from '@/lib/mock';
import {getRandomColor, getRandomUniqueItem} from '@/lib/utils';
import {FC, SVGProps, useEffect, useState} from 'react';

type RandomQuestionProps = {
  defaultColor?: string;
  defaultQuestion?: string;
};

export const RandomQuestion: FC<RandomQuestionProps> = ({defaultColor, defaultQuestion}) => {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);

  useEffect(() => {
    getNextQuestion();
  }, []);

  let previousPicks: (typeof mockQuestions)[number][] = [];

  const getNextQuestion = () => {
    const nextQuestion = getRandomUniqueItem(mockQuestions, previousPicks);
    setCurrentShapeIdx((prevIndex) => (prevIndex + 1) % Shapes.length);

    if (nextQuestion) {
      previousPicks.push(nextQuestion);

      setCurrentQuestion(nextQuestion);
    } else {
      // All questions have been used, reset previousPicks
      previousPicks = [];
      const question = getRandomUniqueItem(mockQuestions, previousPicks);
      if (!question) {
        return;
      }
      setCurrentQuestion(question);
    }
  };

  const CurrentShape = Shapes[currentShapeIdx];

  return (
    <div onClick={getNextQuestion}>
      <CurrentShape fill={defaultColor ?? getRandomColor(ShapeColors)}>
        {defaultQuestion ?? currentQuestion}
      </CurrentShape>
    </div>
  );
};
