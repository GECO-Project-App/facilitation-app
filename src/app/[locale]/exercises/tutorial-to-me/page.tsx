'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {Textarea} from '@/components/ui/textarea/textarea';
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
      <Carousel className="h-full w-full flex-1" setApi={setApi}>
        <CarouselContent>
          {steps.map((step, index) => (
            <CarouselItem
              key={index}
              className="space-y-6 h-[68vh] overflow-y-auto overflow-x-hidden">
              <h1 className="text-xl font-bold">{step.description}</h1>
              <div className="grid w-full gap-1.5 text-center justify-center">
                <label htmlFor={`${step.title} 1`}>Your {step.title} 1</label>
                <Textarea
                  id={`${step.title} 1`}
                  rows={7}
                  className="w-[88vw] rounded-xl border-2 border-black shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
              </div>
              <div className="grid w-full gap-1.5 text-center justify-center">
                <label htmlFor={`${step.title} 2`}>Your {step.title} 2</label>
                <Textarea
                  id={`${step.title} 2`}
                  rows={7}
                  className="w-[88vw] rounded-xl border-2 border-black shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
              </div>
              <div className="grid w-full gap-1.5 pb-10  text-center justify-center">
                <label htmlFor={`${step.title} 3`}>Your {step.title} 3</label>
                <Textarea
                  id={`${step.title} 3`}
                  rows={7}
                  className="w-[88vw] rounded-xl border-2 border-black shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </PageLayout>
  );
};

export default TutorialToMePage;
