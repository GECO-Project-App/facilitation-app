'use client';
import {PageLayout, RiveAnimation, Timer} from '@/components';
import StepCounter from '@/components/ssc-exercise/StepCounter';
import DescriptionWrapper from '@/components/styles/DescriptionWrapper';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
import {Button} from '@/components/ui/button';
import {sscMock} from '@/lib/mock';
import {Step} from '@/lib/types';
import {useRouter} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import React, {useMemo, useState, useEffect} from 'react';
import FooterWrapper from '@/components/styles/FooterWrapper';
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

  const areAllChaptersComplete = (completedChapters: string[]): boolean => {
    const requiredChapters = ['start', 'stop', 'continue'];
    return requiredChapters.every((chapter) => completedChapters.includes(chapter));
  };

  const handleNextStep = () => {
    if (currentStep === steps.length - 1) {
      const completedChapters = JSON.parse(localStorage.getItem('chapterDone') || '[]');
      if (!completedChapters.includes(chapter)) {
        completedChapters.push(chapter);
        localStorage.setItem('chapterDone', JSON.stringify(completedChapters));
      }

      router.push(
        areAllChaptersComplete(completedChapters) ? '/ssc/feedback' : '/ssc/accomplishment',
      );
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!steps) {
    return <div>Loading...</div>;
  }

  const currentStepData = steps[currentStep];
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <PageLayout
      backgroundColor="bg-blue"
      header={
        <Header>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button variant="blue" className="mx-auto" asChild>
            <Link href={`/ssc/accomplishment`}>
              {/* {t('completeButton')} <Complete stroke="white" /> */}
              Complete Button
              <Complete stroke="white" />
            </Link>
          </Button>
        ) : (
          <Button variant="yellow" className="mx-auto" asChild>
            {/* <Link href="/">{t('homeButton')}</Link> */}
            <Link href="/">Home</Link>
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
                  {chapterSteps[index].timer && <Timer seconds={chapterSteps[index].timer} />}
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
