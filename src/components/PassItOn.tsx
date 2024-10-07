'use client';
import {mockPassItOn} from '@/lib/mock';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import {CarouselPagination} from './CarouselPagination';
import {Header} from './Header';
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
import {Link, useRouter} from '@/navigation';

export const PassItOn: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.passItOn');
  const steps: string[] = t.raw('steps').map((step: string) => step);
  const router = useRouter();

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
        <Button variant="yellow" className="mx-auto" asChild>
          <Link href="/">Back to menu</Link>
        </Button>
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
