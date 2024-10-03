'use client';
import {mockPassItOn} from '@/lib/mock';
import {cn} from '@/lib/utils';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {FC, useCallback, useState} from 'react';
import {HomeButton} from './HomeButton';
import {BackButton} from './NavBar/BackButton';
import {Button} from './ui';
import {RiveAnimation} from './RiveAnimation';
import {useTranslations} from 'next-intl';
import {PageLayout} from './PageLayout';
import {Link} from '@/navigation';

export const PassItOn: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations('exercises.passItOn');
  const steps: string[] = t.raw('steps').map((step: string) => step);

  const goToPreviousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => (prev < mockPassItOn.length - 1 ? prev + 1 : prev));
  };

  const Navigation = () => (
    <nav className={cn('relative flex w-full flex-row items-center justify-center')}>
      <div className="absolute left-0 top-0">
        {currentStep === 0 ? (
          <BackButton />
        ) : (
          <button onClick={goToPreviousStep} disabled={currentStep === 0}>
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
      <section className="flex flex-1 flex-col items-center justify-between">
        <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
          <div
            className={cn(
              currentStep === 0 ? 'bg-yellow' : '',
              currentStep === 1 ? 'bg-pink' : '',
              currentStep === 2 ? 'bg-green' : '',
              'aspect-square h-11 w-11 rounded-full border-2 border-black p-1 text-2xl font-semibold text-black',
            )}>
            {currentStep + 1}
          </div>
          <Illustration />
          <p className="text-white">{steps[currentStep]}</p>
        </div>

        <div>
          {currentStep < steps.length - 1 ? (
            <Button onClick={goToNextStep} variant="pink">
              {t('button')} <ArrowRight size={32} />
            </Button>
          ) : (
            <Button onClick={goToNextStep} variant="pink" asChild>
              <Link href={'/'}>{t('home')}</Link>
            </Button>
          )}
        </div>
      </section>
    </PageLayout>
  );
};
