'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {SSCBrainstormSchema, sscBrainstormSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Textarea} from './ui';
import {CarouselApi} from './ui/carousel';

const ssc = {
  description: 'What is one thing the team should {stage} doing? ',
  stages: {
    brainstorm: {
      title: 'Brainstorm',
      description:
        'In this chapter, you will brainstorm and discuss what are the things you could start, stop, and continue doing as a community to better support the productivity, communication, etc. Give an example of how this might help you and the community to thrive. ',
    },
    review: {
      title: 'Review',
      description:
        'In this chapter, you will review the one thing that everyone from your team wrote down. Swipe right if you agree with their point, swipe left if you disagree with their point.',
    },
  },
  start: {
    steps: ['Step 1', 'Step 2', 'Step 3'],
  },
  stop: {
    steps: ['Step 4', 'Step 5', 'Step 6'],
  },
  continue: {
    steps: ['Step 7', 'Step 8', 'Step 9'],
  },
};

export const SSCSwipe: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations();
  const chapters = t.raw(`ssc.chapters`);
  const [stage, setStage] = useState<'start' | 'stop' | 'continue'>('continue');
  const steps: string[] = t.raw(`exercises.ssc.${stage}.steps`).map((step: string) => step);
  const router = useRouter();
  const {toast} = useToast();
  const today = new Date();

  // exercises/ssc?stage=brainstorm?chapter=start?step=1
  const form = useForm<SSCBrainstormSchema>({
    resolver: zodResolver(sscBrainstormSchema),
    defaultValues: {
      start: '',
      stop: '',
      continue: '',
    },
  });
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);

  const onSubmit = async (data: SSCBrainstormSchema) => {
    console.log(data);
  };

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      header={
        <Header rightContent={<DateBadge date={new Date()} />}>
          <CarouselPagination steps={steps} currentStep={currentStep} />
        </Header>
      }
      footer={
        currentStep === steps.length - 1 ? (
          <Button
            variant="blue"
            className="mx-auto"
            onClick={() => {
              router.push(`/`);
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
          <Button variant="pink" className="mx-auto" onClick={() => {}}>
            Submit <Send size={22} />
          </Button>
        )
      }>
      <div className="flex flex-col gap-4 h-full w-full flex-1 ">
        <div className="flex flex-row items-center justify-between h-fit gap-2 ">
          {Object.keys(chapters).map((chapter: string, index: number) => (
            <button
              key={index}
              className={cn(
                chapter === 'start' ? 'bg-yellow' : '',
                chapter === 'stop' ? 'bg-red' : '',
                chapter === 'continue' ? 'bg-green' : '',
                'px-4 md:px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black disabled:opacity-50 disabled:pointer-events-none',
              )}
              disabled={stage !== chapter}>
              {chapters[chapter]}
            </button>
          ))}
        </div>
        <p className="text-center text-2xl ">
          {t('ssc.description', {stage: t(`ssc.chapters.${stage}`)})}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <FormField
              control={form.control}
              name={stage}
              render={({field}) => (
                <FormItem className="flex flex-col flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="240-480 characters *"
                      className={cn(
                        'flex-grow resize-none ',
                        field.name === 'start' ? '!border-yellow' : '',
                        field.name === 'stop' ? '!border-red' : '',
                        field.name === 'continue' ? '!border-green' : '',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {/* <div className="flex-1 flex flex-col">
          <Textarea
            id="full-height-textarea"
            placeholder="Type your content here..."
            className="flex-grow resize-none !border-yellow"
          />

        </div> */}
      </div>
    </PageLayout>
  );
};
