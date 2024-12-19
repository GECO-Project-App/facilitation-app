'use client';
import {RiveAnimation} from '@/components/RiveAnimation';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {getReviewAnswers} from '@/lib/getReviewAnswers';
import {useExercisesStore} from '@/store/useExercises';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import ChapterAnswer from './ChapterAnswer';
export default function ReviewAnswers({chapter}: {chapter: string}) {
  const {setThisReviewDone} = useSSCChaptersHandler();
  const router = useRouter();
  const {exercises} = useExercisesStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const answersData = getReviewAnswers(chapter, exercises);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
    if (currentStep + 1 > answersData.length - 1) {
      setThisReviewDone(chapter);
      router.back();
    }
  }, [api, currentStep]);

  return (
    <div className="h-full text-black overflow-hidden w-full">
      <Carousel className="h-full w-full flex-1" orientation="vertical" setApi={setApi}>
        <CarouselContent className="h-[100dvh]">
          {answersData?.map((answers, i) => (
            <CarouselItem key={i} className="space-y-6">
              {i === 0 && (
                <div className="flex items-center justify-center h-screen text-lg">
                  <RiveAnimation src="swipe_up.riv" height={160} width={160} />
                </div>
              )}
              <ChapterAnswer
                key={i}
                chapter={chapter}
                answers={answers.answers}
                replyId={answers.replyId}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
