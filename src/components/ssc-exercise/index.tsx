'use client';
import {PageLayout, RiveAnimation, Timer} from '@/components';
import {Button} from '@/components/ui/button';
import {sscMock} from '@/lib/mock';
import {Step} from '@/lib/types';
import React, {useMemo, useState, useEffect} from 'react';
import {Header} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {Link} from '@/navigation';
import {Complete} from '@/components/icons';
import {useTranslations} from 'next-intl';
import {ArrowRight} from 'lucide-react';
import {useRouter} from '@/navigation';

export type SSCExerciseProps = {
  chapter: string;
  steps: Step[];
};

const SSCExercise: React.FC<SSCExerciseProps> = ({chapter, steps}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.ssc');
  const [api, setApi] = useState<CarouselApi>();

  const chapterMap = {
    start: sscMock.start.steps,
    stop: sscMock.stop.steps,
    continue: sscMock.continue.steps,
  };

  const chapterSteps = useMemo(() => {
    return chapterMap[chapter as keyof typeof chapterMap] || sscMock.start.steps;
  }, [chapter]);

  if (!steps) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);

  const handleComplete = () => {
    console.log('complete');
    const completedChapters = JSON.parse(localStorage.getItem('chapterDone') || '[]');
    if (!completedChapters.includes(chapter)) {
      completedChapters.push(chapter);
      localStorage.setItem('chapterDone', JSON.stringify(completedChapters));
    }
  };

  const nextStep = () => {
    api?.scrollNext();
  };

  const previousStep = () => {
    if (currentStep >= 1) {
      api?.scrollPrev();
    } else {
      router.push('/exercises/ssc');
    }
  };

  return (
    <PageLayout
      backgroundColor="bg-blue"
      header={
        <Header onBackButton={previousStep}>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button variant="blue" className="mx-auto" asChild onClick={handleComplete}>
            <Link href={`/ssc/accomplishment`}>
              {t('completeButton')} <Complete stroke="white" />
            </Link>
          </Button>
        ) : (
          <Button variant="yellow" onClick={nextStep} >
          {t('nextStep')} <ArrowRight />
        </Button>

        )
      }>
      <section className="flex h-full w-full flex-1 items-center justify-center">
        <Carousel className="h-full w-full flex-1" setApi={setApi}>
          <CarouselContent>
            {steps.map((_, index) => (
              <CarouselItem key={index} className="space-y-6">
                <p className="text-2xl">{steps[index].description}</p>
                <div className="relative aspect-video">
                  {chapterSteps[index].sticker && (
                    <RiveAnimation src={chapterSteps[index].sticker} width="100%" height="100%" />
                  )}
                  {chapterSteps[index].timer && (
                    <div className="pt-10">
                      <Timer seconds={chapterSteps[index].timer} />
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex flex-row items-center justify-between">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </section>
    </PageLayout>
  );
};

export default SSCExercise;
