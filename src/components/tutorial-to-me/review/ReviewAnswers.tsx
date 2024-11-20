'use client';
import {Button} from '@/components/ui';
import {useExercisesStore} from '@/store/useExercises';
import {useEffect, useRef} from 'react';
import ChapterAnswer from './ChapterAnswer';
export default function ReviewAnswers({chapter}: {chapter: string}) {
  const {exercises} = useExercisesStore();
  let answersData;
  if (chapter === 'strength') {
    answersData = exercises.map((e) => e.answers.strengths.split(','));
  } else if (chapter === 'weakness') {
    answersData = exercises.map((e) => e.answers.weaknesses.split(','));
  } else if (chapter === 'communication') {
    answersData = exercises.map((e) => e.answers.communications.split(','));
  }
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNextClick = () => {
    if (containerRef.current) {
      const screenHeight = window.innerHeight;
      containerRef.current.scrollBy({
        top: screenHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleBackClick = () => {
    if (containerRef.current) {
      const screenHeight = window.innerHeight;
      containerRef.current.scrollBy({
        top: -screenHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartY = e.touches[0].clientY;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const touchEndY = moveEvent.touches[0].clientY;
        const touchDifference = touchStartY - touchEndY;

        if (containerRef.current) {
          const screenHeight = window.innerHeight;
          if (touchDifference > 50) {
            // Swipe up
            containerRef.current.scrollBy({
              top: screenHeight,
              behavior: 'smooth',
            });
          } else if (touchDifference < -50) {
            // Swipe down
            containerRef.current.scrollBy({
              top: -screenHeight,
              behavior: 'smooth',
            });
          }
        }
      };

      const handleTouchEnd = () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <>
      <Button className="fixed bottom-0 right-0 p-2 m-4 text-sm " onClick={handleNextClick}>
        Next
      </Button>
      <Button className="fixed bottom-0 left-0 p-2 m-4 text-sm" onClick={handleBackClick}>
        Back
      </Button>
      <div ref={containerRef} className="h-full text-black overflow-auto w-full">
        {answersData?.map((a, index) => (
          <div key={index} className="h-full text-black w-full">
            <div className="flex flex-col">
              <ChapterAnswer chapter={chapter} answers={a} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
