'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import ReviewTimeAtHeader from '@/components/tutorial-to-me/ReviewTimeAtHeader';
import TextAreaForTutorial from '@/components/tutorial-to-me/text-area/TextAreaForTutorial';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {useTutorialLocalStorage} from '@/hooks/useTutorialLocalStorage';
import {saveTutorialToMeAnswer} from '@/lib/actions/exerciseAnswerAction';
import {Step} from '@/lib/types';
import {useTeamStore} from '@/store/teamStore';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {createExercise} from './create-exercise';
const TutorialToMePage = ({params}: {params: {slug: string}}) => {
  const {slug} = params;
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const {one, two, three, setOne, setTwo, setThree, clearTutorialLocalStorage} =
    useTutorialLocalStorage(currentStep);
  const t = useTranslations('exercises.tutorialToMe');
  const router = useRouter();
  const steps: Step[] = t.raw('steps').map((step: Step) => step);
  const {currentTeam} = useTeamStore();

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
  }, [api, setCurrentStep, steps.length]);

  const nextStep = () => {
    if (currentStep === 0) {
      const strengths = [one, two, three];
      localStorage.setItem('strengths', JSON.stringify(strengths));
    }
    if (currentStep === 1) {
      const weaknesses = [one, two, three];
      localStorage.setItem('weaknesses', JSON.stringify(weaknesses));
    }
    if (currentStep === 2) {
      const communications = [one, two, three];
      localStorage.setItem('communications', JSON.stringify(communications));
    }
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
    const communicationsData = [one, two, three];
    localStorage.setItem('communications', JSON.stringify(communicationsData));
    const strengths = JSON.parse(localStorage.getItem('strengths') ?? '[]') as string[];
    const weaknesses = JSON.parse(localStorage.getItem('weaknesses') ?? '[]') as string[];
    const communications = JSON.parse(localStorage.getItem('communications') ?? '[]') as string[];
    const saveAnswerDat = {
      strengths,
      weaknesses,
      communications,
      exercise_id: slug,
      team_id: currentTeam?.id ?? '',
      created_by: currentTeam?.created_by ?? '',
    };
    if (slug === 'create') {
      createExercise(saveAnswerDat).then(() => {
        clearTutorialLocalStorage();
      });
    } else {
      saveTutorialToMeAnswer(saveAnswerDat).then(() => {
        clearTutorialLocalStorage();
      });
    }

    router.push(`./${slug}/review`);
  };

  const colorClass = getColorClass(currentStep);
  const divRef = useRef<HTMLDivElement | null>(null);
  const divFooterRef = useRef<HTMLDivElement | null>(null);
  const [divHeaderHeight, setDivHeaderHeight] = useState<number>(0);
  const [divFooterHeight, setDivFooterHeight] = useState<number>(0);

  useEffect(() => {
    if (divRef.current) {
      setDivHeaderHeight(divRef.current.clientHeight);
    }
  }, [divRef]);
  useEffect(() => {
    if (divFooterRef.current) {
      setDivFooterHeight(divFooterRef.current.clientHeight);
    }
  }, [divFooterRef]);

  return (
    <PageLayout
      backgroundColor={`bg-${colorClass}`}
      hasPadding={false}
      header={
        <div ref={divRef}>
          <Header onBackButton={previousStep}>
            <div className="flex justify-between items-center w-full">
              <div></div>
              <CarouselPagination steps={steps} currentStep={currentStep} />
              <ReviewTimeAtHeader />
            </div>
          </Header>
        </div>
      }
      footer={
        <div ref={divFooterRef}>
          {currentStep === steps.length - 1 ? (
            <Button variant="blue" className="mx-auto" onClick={handleComplete}>
              {t('submit')}
            </Button>
          ) : (
            <Button variant="blue" onClick={nextStep}>
              {t('submit')} <ArrowRight />
            </Button>
          )}
        </div>
      }>
      <Carousel className="h-full w-full flex-1" setApi={setApi}>
        <CarouselContent>
          {steps.map((step, index) => (
            <CarouselItem
              key={index}
              className={`space-y-6 overflow-y-auto overflow-x-hidden`}
              style={{height: `calc(92vh - ${divHeaderHeight + divFooterHeight}px)`}}>
              <>
                <h1 className="text-xl font-bold">{step.description}</h1>
                <TextAreaForTutorial
                  title={`${step.title} 1`}
                  borderColor={colorClass}
                  setValue={setOne}
                  value={one}
                />
                <TextAreaForTutorial
                  title={`${step.title} 2`}
                  borderColor={colorClass}
                  setValue={setTwo}
                  value={two}
                />
                <TextAreaForTutorial
                  title={`${step.title} 3`}
                  borderColor={colorClass}
                  setValue={setThree}
                  value={three}
                />
              </>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </PageLayout>
  );
};

export default TutorialToMePage;
