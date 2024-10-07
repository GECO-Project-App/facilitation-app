'use client';
import {mockPassItOn} from '@/lib/mock';
import {cn} from '@/lib/utils';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {FC, useCallback, useEffect, useState} from 'react';
import {HomeButton} from './HomeButton';
import {BackButton} from './NavBar/BackButton';
import {Button} from './ui';
import {RiveAnimation} from './RiveAnimation';
import {useTranslations} from 'next-intl';
import {PageLayout} from './PageLayout';
import {Link} from '@/navigation';
import {Carousel, CarouselPrevious, CarouselItem, CarouselNext, CarouselApi} from './ui/carousel';
import {CarouselContent} from './ui/carousel';

export const PassItOn: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const [count, setCount] = useState(0);
  const t = useTranslations('exercises.passItOn');
  const steps: string[] = t.raw('steps').map((step: string) => step);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrentStep(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap() + 1);
    });
    console.log(currentStep);
  }, [api]);

  const Navigation = () => (
    <nav className={cn('relative flex w-full flex-row items-center justify-center')}>
      <div className="absolute left-0 top-0">
        {currentStep === 0 ? (
          <BackButton />
        ) : (
          <button onClick={() => api?.scrollTo(currentStep - 1)} disabled={currentStep === 0}>
            <ArrowLeft size={42} />
          </button>
        )}
      </div>

      <div className="mx-auto whitespace-nowrap rounded-full border-2 border-black bg-yellow px-6 py-2 font-semibold">
        {t('title')}
      </div>
    </nav>
  );

  const Illustration = useCallback(() => {
    switch (currentStep) {
      case 0:
        return <RiveAnimation src={mockPassItOn[currentStep].rive} />;
      case 1:
        return <RiveAnimation src={mockPassItOn[currentStep].rive} />;
      case 2:
        return <RiveAnimation src={mockPassItOn[currentStep].rive} height={160} width={160} />;
      default:
        break;
    }
  }, [currentStep]);

  return (
    <PageLayout backgroundColor="bg-blue">
      <Navigation />
      <section className="flex h-full w-full flex-1 items-center justify-center bg-red">
        <Carousel className="h-full w-full flex-1 bg-yellow" setApi={setApi}>
          <CarouselContent>
            {steps.map((_, index) => (
              <CarouselItem key={index}>
                <p>{steps[index]}</p>
                <Illustration />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </PageLayout>
  );
};
