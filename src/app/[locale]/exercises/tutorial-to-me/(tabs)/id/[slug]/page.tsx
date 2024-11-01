'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import Review from '@/components/tutorial-to-me/review/Review';
import TextAreaForTutorial from '@/components/tutorial-to-me/text-area/TextAreaForTutorial';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {Step} from '@/lib/types';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
const TutorialToMePage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.tutorialToMe');
  const router = useRouter();
  const steps: Step[] = t.raw('steps').map((step: Step) => step);

  const getColorClass = (step: number) => {
    switch (step) {
      case 0:
        return 'yellow';
      case 1:
        return 'pink';
      case 2:
        return 'orange';
      case 3:
        return 'purple';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api, setCurrentStep]);

  const nextStep = () => {
    api?.scrollNext();
  };

  const previousStep = () => {
    if (currentStep >= 1) {
      api?.scrollPrev();
    } else {
      router.push(`/`);
    }
  };

  const handleComplete = () => {
    console.log('complete');
  };

  const colorClass = getColorClass(currentStep);

  return (
    <PageLayout
      backgroundColor={`bg-${colorClass}`}
      header={
        <Header onBackButton={previousStep}>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button variant="blue" className="mx-auto" onClick={handleComplete}>
            {t('submit')}
          </Button>
        ) : (
          <Button variant="blue" onClick={nextStep}>
            {t('submit')} <ArrowRight />
          </Button>
        )
      }>
      <Carousel className="h-full w-full flex-1" setApi={setApi}>
        <CarouselContent>
          {steps.map((step, index) => (
            <CarouselItem
              key={index}
              className="space-y-6 h-[70vh] overflow-y-auto overflow-x-hidden">
              {currentStep <= 2 ? (
                <>
                  <h1 className="text-xl font-bold">{step.description}</h1>
                  <TextAreaForTutorial title={`${step.title} 1`} borderColor={colorClass} />
                  <TextAreaForTutorial title={`${step.title} 2`} borderColor={colorClass} />
                  <TextAreaForTutorial title={`${step.title} 3`} borderColor={colorClass} />
                </>
              ) : (
                <Review message={step.description} />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </PageLayout>
  );
};

export default TutorialToMePage;
