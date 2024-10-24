'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {Step} from '@/lib/types';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

const TutorialToMePage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.tutorialToMe');

  const steps: Step[] = t.raw('steps').map((step: Step) => step);
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
      console.log('previous step');
    }
  };

  const handleComplete = () => {
    console.log('complete');
  };

  return (
    <PageLayout
      backgroundColor="bg-red"
      header={
        <Header onBackButton={previousStep}>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button variant="blue" className="mx-auto" onClick={handleComplete}>
            Complete
          </Button>
        ) : (
          <Button variant="blue" onClick={nextStep}>
            Next <ArrowRight />
          </Button>
        )
      }>
      <section className="flex h-full w-full flex-1 items-center justify-center">
        <Carousel className="h-full w-full flex-1" setApi={setApi}>
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem key={index} className="space-y-6">
                <h1 className="text-2xl font-bold">{step.title}</h1>
                <p className="text-lg">Type your {step.title}</p>
                <textarea
                  rows={10}
                  className="h-full w-full rounded-3xl border-2 border-black px-4 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
                <p className="text-lg">Type your {step.title}</p>
                <textarea
                  rows={10}
                  className="h-full w-full rounded-3xl border-2 border-black px-4 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
                <p className="text-lg">Type your {step.title}</p>
                <textarea
                  rows={10}
                  className="h-full w-full rounded-3xl border-2 border-black px-4 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </PageLayout>
  );
};

export default TutorialToMePage;
