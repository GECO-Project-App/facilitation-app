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
  const [answersData, setAnswersData] = useState<string[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (chapter === 'strength') {
      setAnswersData(exercises.map((e) => e.answers.strengths.split(',')));
    } else if (chapter === 'weakness') {
      setAnswersData(exercises.map((e) => e.answers.weaknesses.split(',')));
    } else if (chapter === 'communication') {
      setAnswersData(exercises.map((e) => e.answers.communications.split(',')));
    }

    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api, setCurrentStep]);

  console.log('currentStep :', currentStep);

  // const chapterDone = () => {
  //   console.log('chapterDone :', chapter);
  //   setThisReviewDone(chapter);
  //   router.back();
  // };

  console.log('length :', answersData);

  return (
    <div className="h-full text-black overflow-hidden w-full">
      <Carousel className="h-full w-full flex-1" orientation="vertical" setApi={setApi}>
        <CarouselContent className="h-[100dvh]">
          {answersData?.map((answers, i) => (
            <CarouselItem key={i} className="space-y-6">
              <ChapterAnswer key={i} chapter={chapter} answers={answers} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <Button onClick={chapterDone} variant="noShadow" size="small" className="mx-auto">
          Done
        </Button> */}
      </Carousel>
    </div>
  );
}
