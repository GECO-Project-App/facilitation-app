'use client';
import {Button} from '@/components/ui/button';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useExercisesStore} from '@/store/useExercises';
import {ArrowDown, ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useRef} from 'react';
import ChapterAnswer from './ChapterAnswer';
export default function ReviewAnswers({chapter}: {chapter: string}) {
  const {setThisReviewDone} = useSSCChaptersHandler();
  const router = useRouter();
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

  const chapterDone = () => {
    console.log('chapterDone :', chapter);
    setThisReviewDone(chapter);
    router.back();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const startY = event.touches[0].clientY;

    const handleTouchMove = (() => {
      let hasLogged = false;
      return (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY;
        if (!hasLogged) {
          if (currentY < startY) {
            handleNextClick();
          } else if (currentY > startY) {
            handleBackClick();
          }
          hasLogged = true;
        }
      };
    })();

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <>
      <div className="fixed top-0 right-0 m-2 text-sm" onClick={handleBackClick}>
        <ArrowUp size={32} color="black" />
      </div>
      <div className="fixed bottom-0 right-0 m-2 text-sm" onClick={handleNextClick}>
        <ArrowDown size={32} color="black" />
      </div>
      <div
        ref={containerRef}
        className="h-full text-black overflow-y-hidden w-full"
        onTouchStart={handleTouchStart}>
        {answersData?.map((answers, index) => (
          <div key={index} className="h-full text-black w-full">
            <div className="flex flex-col">
              <ChapterAnswer chapter={chapter} answers={answers} />
            </div>
            {index === answersData.length - 1 && (
              <div className="w-full text-center">
                <Button variant="white" onClick={chapterDone}>
                  Back
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
