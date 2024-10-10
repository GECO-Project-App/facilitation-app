'use client';
import {mockPassItOn} from '@/lib/mock';
import {Link} from '@/navigation';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import {CarouselPagination} from './CarouselPagination';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

export const PassItOn: FC<{slug: string}> = ({slug}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.passItOn');
  const steps: string[] = t.raw('steps').map((step: string) => step);

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
            <Link href={`/exercises/${slug}/accomplishment`}>
              {t('completeButton')} <Complete />
            </Link>
          </Button>
        ) : (
          <Button variant="yellow" className="mx-auto" asChild>
            <Link href="/">{t('homeButton')}</Link>
          </Button>
        )
      }>
      <section className="flex h-full w-full flex-1 items-center justify-center">
        <Carousel className="h-full w-full flex-1" setApi={setApi}>
          <CarouselContent>
            {steps.map((_, index) => (
              <CarouselItem key={index} className="space-y-6">
                <p className="text-2xl">{steps[index]}</p>
                <div className="relative aspect-video">
                  <RiveAnimation src={mockPassItOn[index].rive} width="100%" height="100%" />
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
