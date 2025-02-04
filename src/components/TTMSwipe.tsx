'use client';
import {toast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {TTMExercisesSchema, ttmSchema} from '@/lib/zodSchemas';
import {useExerciseStore} from '@/store/exerciseStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
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

export const TTMSwipe: FC<{deadline: Date}> = ({deadline}) => {
  const t = useTranslations('exercises');
  const tCommon = useTranslations('common');
  const [api, setApi] = useState<CarouselApi>();

  const steps: {title: string; description: string}[] = t
    .raw('tutorialToMe.steps')
    .map((step: {title: string; description: string}) => step);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const searchParams = useSearchParams();

  const {setData, submitExerciseData, data} = useExerciseStore();

  const form = useForm<TTMExercisesSchema>({
    resolver: zodResolver(ttmSchema),
    defaultValues: {
      strengths: {
        value: data?.strengths.value ?? '',
        vote: {
          yes: 1,
          no: 0,
        },
      },
      weaknesses: {
        value: data?.weaknesses.value ?? '',
        vote: {
          yes: 1,
          no: 0,
        },
      },
      communication: {
        value: data?.communication.value ?? '',
        vote: {
          yes: 1,
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

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData) {
        setData(formData as TTMExercisesSchema);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setData]);

  const onSubmit = async (data: TTMExercisesSchema) => {
    const exerciseId = searchParams.get('id');

    if (currentStep < 2) {
      api?.scrollTo(currentStep + 1);
      setData(data);
      return;
    } else {
      if (!exerciseId) return;

      const exerciseData = await submitExerciseData(exerciseId, data);
      if (exerciseData) {
        setData(null);

        toast({
          variant: 'success',
          title: t('toast.success'),
        });
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        toast({
          variant: 'destructive',
          title: t('toast.error'),
        });
      }
    }
  };

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      header={
        <Header rightContent={<DateBadge date={deadline} />}>
          <CarouselPagination
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </Header>
      }
      footer={
        <Button variant="purple" className="mx-auto" onClick={form.handleSubmit(onSubmit)}>
          {currentStep === 2 ? tCommon('submit') : tCommon('next')}
        </Button>
      }>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full w-full flex-1">
          <Carousel className="h-full flex-1" setApi={setApi}>
            <CarouselContent>
              {Object.entries(form.getValues()).map(([key, _], index) => (
                <CarouselItem key={index} className="aspect-[4/6]">
                  <p className="text-center text-xl pb-4">
                    {t.rich('tutorialToMe.desc', {
                      stage: t(`tutorialToMe.stages.${key}`).toLowerCase(),
                      bold: (chunks) => <span className="font-bold">{chunks}</span>,
                    })}
                  </p>
                  <FormField
                    control={form.control}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={`${key}.value` as any}
                    render={({field}) => {
                      return (
                        <FormItem className="flex flex-col h-full">
                          <FormControl>
                            <Textarea
                              placeholder={field.value}
                              className="flex-grow resize-none"
                              {...field}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </form>
      </Form>
    </PageLayout>
  );
};
