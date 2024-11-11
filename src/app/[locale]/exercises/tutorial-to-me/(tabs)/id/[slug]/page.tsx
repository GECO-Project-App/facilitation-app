'use client';
import {Header, PageLayout} from '@/components';
import {CarouselPagination} from '@/components/CarouselPagination';
import Review from '@/components/tutorial-to-me/review/Review';
import TextAreaForTutorial from '@/components/tutorial-to-me/text-area/TextAreaForTutorial';
import {Button} from '@/components/ui/button/button';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import {saveTutorialToMeAnswer} from '@/lib/actions/exerciseAnswerAction';
import {Step} from '@/lib/types';
import {useTeamStore} from '@/store/teamStore';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {createExercise} from './create-exercise';

const TutorialToMePage = ({params}: {params: {slug: string}}) => {
  const {slug} = params;
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
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
  }, [api, setCurrentStep]);

  const [one, setOne] = useState(JSON.parse(localStorage.getItem('strengths') ?? '[]')[0] ?? '');
  const [two, setTwo] = useState(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
  const [three, setThree] = useState(
    JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '',
  );

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

    if (currentStep + 1 >= steps.length - 1) {
      console.log('Complete');
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
        createExercise(saveAnswerDat);
      } else {
        saveTutorialToMeAnswer(saveAnswerDat);
      }
      api?.scrollNext();
    } else {
      api?.scrollNext();
    }
  };

  const previousStep = () => {
    console.log('currentStep', currentStep);
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

  useEffect(() => {
    if (currentStep === 0) {
      setOne(JSON.parse(localStorage.getItem('strengths') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '');
    }
    if (currentStep === 1) {
      setOne(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[2] ?? '');
    }
    if (currentStep === 2) {
      setOne(JSON.parse(localStorage.getItem('communications') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('communications') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('communications') ?? '[]')[2] ?? '');
    }
  }, [currentStep]);

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
