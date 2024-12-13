'use client';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useExercisesStore} from '@/store/useExercises';
import useEmblaCarousel from 'embla-carousel-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
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

  const [emblaRef, emblaApi] = useEmblaCarousel({axis: 'y'});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const chapterDone = () => {
    console.log('chapterDone :', chapter);
    setThisReviewDone(chapter);
    router.back();
  };
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentStep(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api, setCurrentStep]);

  return (
    <div ref={emblaRef} className="h-full text-black overflow-hidden w-full">
      <Carousel className="h-full w-full flex-1" setApi={setApi}>
        <CarouselContent>
          {answersData?.map((answers, i) => (
            <CarouselItem key={i} className="space-y-6">
              <ChapterAnswer key={i} chapter={chapter} answers={answers} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
