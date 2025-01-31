'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {SSCBrainstormSchema, sscBrainstormSchema} from '@/lib/zodSchemas';
import {useExerciseStore} from '@/store/exerciseStore';
import {useLocalStore} from '@/store/localStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {SSCButtons} from './SSCButtons';
import {
  Button,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from './ui';

type SSCSwipeProps = {
  deadline: Date;
};

export const SSCSwipe: FC<SSCSwipeProps> = ({deadline}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations();
  const [api, setApi] = useState<CarouselApi>();
  const router = useRouter();
  const {toast} = useToast();
  const {setStage} = useLocalStore();
  const {setData, data, submitExerciseData} = useExerciseStore();
  const searchParams = useSearchParams();

  const form = useForm<SSCBrainstormSchema>({
    resolver: zodResolver(sscBrainstormSchema),
    defaultValues: {
      start: {
        value: data?.start.value ?? '',
        vote: {
          yes: 0,
          no: 0,
        },
      },
      stop: {
        value: data?.stop.value ?? '',
        vote: {
          yes: 0,
          no: 0,
        },
      },
      continue: {
        value: data?.continue.value ?? '',
        vote: {
          yes: 0,
          no: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());
    setStage(Object.keys(form.getValues())[currentStep] as ExerciseStage);
    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
      setStage(Object.keys(form.getValues())[currentStep] as ExerciseStage);
    });
  }, [api, currentStep, form, setStage]);

  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData) {
        setData(formData as SSCBrainstormSchema);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setData]);

  const onSubmit = async (data: SSCBrainstormSchema) => {
    const exerciseId = searchParams.get('id');

    setStage(Object.keys(form.getValues())[currentStep] as ExerciseStage);
    if (currentStep < 2) {
      api?.scrollTo(currentStep + 1);

      return;
    } else {
      if (!exerciseId) return;

      const exerciseData = await submitExerciseData(exerciseId, data);
      if (exerciseData) {
        setData(null);
        setStage(null);
        toast({
          variant: 'success',
          title: t('exercises.toast.success'),
        });
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        toast({
          variant: 'destructive',
          title: t('exercises.toast.error'),
        });
      }
    }
  };

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      header={
        <Header
          rightContent={<DateBadge date={deadline} />}
          onBackButton={() => router.replace('/exercises/ssc/introduction')}>
          <CarouselPagination steps={Object.keys(form.getValues())} currentStep={currentStep} />
        </Header>
      }
      footer={
        <Button variant="pink" className="mx-auto" onClick={form.handleSubmit(onSubmit)}>
          {currentStep === 2 ? t('common.submit') : t('common.next')} <Send size={22} />
        </Button>
      }>
      <div className="flex flex-col gap-4 h-full w-full flex-1 ">
        <SSCButtons selectedStage={Object.keys(form.getValues())[currentStep] as ExerciseStage} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full w-full flex-1">
            <Carousel className="h-full flex-1" setApi={setApi}>
              <CarouselContent>
                {Object.entries(form.getValues()).map(([key, _], index) => (
                  <CarouselItem key={index} className="aspect-[4/6]">
                    <p className="text-center text-xl pb-4">
                      {t('ssc.description', {stage: t(`ssc.chapters.${key}`)})}
                    </p>
                    <FormField
                      control={form.control}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      name={`${key}.value` as any}
                      render={({field}) => (
                        <FormItem className="flex flex-col h-full">
                          <FormControl>
                            <Textarea
                              variant="default"
                              placeholder={`240 - 480 characters`}
                              className={cn(
                                'flex-grow resize-none ',
                                key === 'start' ? '!border-yellow' : '',
                                key === 'stop' ? '!border-red' : '',
                                key === 'continue' ? '!border-green' : '',
                              )}
                              {...field}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};
