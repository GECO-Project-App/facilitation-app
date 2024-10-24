'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {ArrowRight} from 'lucide-react';
import {useEffect, useState} from 'react';

const TutorialToMePage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Strength',
      description: 'What three strengths do you bring to a team when working on a project?',
      button: 'Submit',
    },
    {
      title: 'Weakness',
      description: 'What three weaknesses do you have when working on a project?',
      button: 'Submit',
    },
    {
      title: 'Communication',
      description: 'What three communication practices do you value when working on a project?',
      button: 'Submit',
    },
    {
      title: 'Finish',
      description: 'Congratulations! You have completed the tutorial to me exercise.',
      button: 'Back to main',
    },
  ];

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
            {steps.map((_, index) => (
              <CarouselItem key={index} className="space-y-6">
                <h1 className="text-2xl font-bold">{steps[index].title}</h1>
                <p className="text-lg">{steps[index].description}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </PageLayout>
  );
};

export default TutorialToMePage;
