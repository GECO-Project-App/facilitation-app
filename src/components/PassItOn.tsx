'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {mockPassItOn} from '@/lib/mock';
import {useLocalStore} from '@/store/localStore';
import {CircleHelp} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import {CarouselPagination} from './CarouselPagination';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Timer} from './Timer';
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
  const {question} = useLocalStore();
  const t = useTranslations();
  const steps: string[] = t.raw('exercises.passItOn.steps').map((step: string) => step);
  const router = useRouter();
  const {toast} = useToast();

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
        <Header
          bottomContent={
            <div className="bg-yellow w-full p-2 border-y-2 border-black flex flex-row justify-center items-center">
              <span className="flex flex-row items-center justify-start gap-4 text-sm md:text-base font-bold text-center w-fit">
                <CircleHelp size={24} className="hidden md:block" /> {question}
              </span>
            </div>
          }>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button
            variant="blue"
            className="mx-auto"
            onClick={() => {
              router.push(`/exercises/${slug}/feedback`);
              toast({
                variant: 'transparent',
                size: 'fullscreen',
                duration: 2000,
                className: 'text-black bg-blue',
                children: (
                  <>
                    <h3 className="text-3xl font-bold">{t('common.greatJob')}</h3>
                    <RiveAnimation src="geckograttis.riv" width={300} height={300} />
                  </>
                ),
              });
            }}>
            {t('exercises.passItOn.completeButton')} <Complete />
          </Button>
        ) : (
          <Button variant="yellow" className="mx-auto" onClick={() => api?.scrollNext()}>
            {t('common.nextStep')}
          </Button>
        )
      }>
      <section className="flex h-full w-full flex-1 items-center justify-center flex-col gap-6 ">
        <Timer seconds={120} />
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
