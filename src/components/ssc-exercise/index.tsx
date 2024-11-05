'use client';
import {Header, PageLayout, RiveAnimation, Timer} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import {Complete} from '@/components/icons';
import {Button} from '@/components/ui/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {paginationColors} from '@/lib/constants';
import {sscMock} from '@/lib/mock';
import {Step} from '@/lib/types';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import React, {useEffect, useMemo, useState} from 'react';

export type SSCExerciseProps = {
  chapter: string;
  steps: Step[];
};

const SSCExercise: React.FC<SSCExerciseProps> = ({chapter, steps}) => {
  const {setChapterDone, isSSCCompleted} = useSSCChaptersHandler();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.ssc');
  const [api, setApi] = useState<CarouselApi>();
  const {toast} = useToast();

  const getButtonVariant = useMemo(() => {
    switch (paginationColors[currentStep + 1]) {
      case 'bg-blue':
        return 'blue';
      case 'bg-pink':
        return 'pink';
      case 'bg-orange':
        return 'orange';
      case 'bg-red':
        return 'red';
      case 'bg-green':
        return 'green';
      default:
        return 'pink';
    }
  }, [currentStep]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api, setCurrentStep]);

  const chapterMap = useMemo(
    () => ({
      start: sscMock.start.steps,
      stop: sscMock.stop.steps,
      continue: sscMock.continue.steps,
    }),
    [],
  );

  const chapterSteps = useMemo(() => {
    return chapterMap[chapter as keyof typeof chapterMap] || sscMock.start.steps;
  }, [chapter, chapterMap]);

  if (!steps) {
    return <div>Loading...</div>;
  }

  const handleComplete = () => {
    setChapterDone(chapter);
    if (isSSCCompleted()) {
      router.push('/exercises/ssc/feedback');
    } else {
      router.push('/exercises/ssc');
      toast({
        variant: 'transparent',
        size: 'fullscreen',
        duration: 2500,
        className: 'text-black bg-blue',
        children: (
          <>
            <h3 className="text-3xl font-bold">{t('greatJob')}</h3>
            <RiveAnimation src="geckograttis.riv" width={300} height={300} />
          </>
        ),
      });
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

  const splitTextIntoParagraphs = (text: string): string[] => {
    return text.split(/(?:\.\s+|\n+)/).filter((paragraph) => paragraph.trim() !== '');
  };

  return (
    <PageLayout
      backgroundColor={sscMock[chapter as Exclude<keyof typeof sscMock, 'about'>].backgroundColor}
      header={
        <Header onBackButton={previousStep}>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button variant="blue" className="mx-auto" onClick={handleComplete}>
            {t('completeButton')} <Complete />
          </Button>
        ) : (
          <Button variant={getButtonVariant} onClick={nextStep}>
            {t('nextStep')} <ArrowRight />
          </Button>
        )
      }>
      <section className="flex h-full w-full flex-1 items-center justify-center">
        <Carousel className="h-full w-full flex-1" setApi={setApi}>
          <CarouselContent>
            {steps.map((_, index) => (
              <CarouselItem key={index} className="space-y-6">
                <h1 className="text-2xl font-bold">{steps[index].title}</h1>
                {splitTextIntoParagraphs(steps[index].description).map((paragraph, index) => (
                  <div key={index} className="flex items-center">
                    <div>
                      <div className="bg-black w-2 h-2 rounded-full mx-2"></div>
                    </div>
                    <li className="text-2xl list-none pl-1">{paragraph}</li>
                  </div>
                ))}
                <div className="relative aspect-video">
                  {chapterSteps[index].sticker && (
                    <RiveAnimation src={chapterSteps[index].sticker} width="100%" height="100%" />
                  )}
                  {chapterSteps[index].timer && (
                    <div className="pt-10">
                      <Timer seconds={chapterSteps[index].timer} className="max-w-64 w-[60vw]" />
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </PageLayout>
  );
};

export default SSCExercise;
