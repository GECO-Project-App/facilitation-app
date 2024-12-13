'use client';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
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

  let answersData;
  if (chapter === 'strength') {
    answersData = exercises.map((e) => ({
      answers: e.answers.strengths.split(','),
      replyId: e.replied_id,
    }));
    answersData.push({
      answers: [''],
      replyId: '',
    });
  } else if (chapter === 'weakness') {
    answersData = exercises.map((e) => ({
      answers: e.answers.weaknesses.split(','),
      replyId: e.replied_id,
    }));
    answersData.push({
      answers: [''],
      replyId: '',
    });
  } else if (chapter === 'communication') {
    answersData = exercises.map((e) => ({
      answers: e.answers.communications.split(','),
      replyId: e.replied_id,
    }));
    answersData.push({
      answers: [''],
      replyId: '',
    });
  }

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
