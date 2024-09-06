'use client';
import {mockQuestions} from '@/lib/mock';
import {getRandomUniqueItem, getRandomColor} from '@/lib/utils';
import {FC, useEffect, useState} from 'react';
import {Star, StarAlt3, StarAlt4, Triangle} from '../icons';
import {ShapeColors} from '@/lib/constants';
const shapes = [Triangle, Star, StarAlt3, StarAlt4];
export const RandomQuestion: FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);

  useEffect(() => {
    getNextQuestion();
  }, []);

  let previousPicks: (typeof mockQuestions)[number][] = [];

  const getNextQuestion = () => {
    const nextQuestion = getRandomUniqueItem(mockQuestions, previousPicks);
    setCurrentShapeIdx((prevIndex) => (prevIndex + 1) % shapes.length);

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

  const CurrentShape = shapes[currentShapeIdx];

  return (
    <div onClick={getNextQuestion}>
      <CurrentShape fill={getRandomColor(ShapeColors)}>{currentQuestion}</CurrentShape>
    </div>
  );
};
