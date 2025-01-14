'use client';
import {TTMExercisesSchema, ttmSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {FC, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Textarea} from './ui';

export const TTMSwipe: FC<{deadline: Date}> = ({deadline}) => {
  const t = useTranslations('exercises.tutorialToMe');
  const steps: {title: string; description: string}[] = t
    .raw('steps')
    .map((step: {title: string; description: string}) => step);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TTMExercisesSchema>({
    resolver: zodResolver(ttmSchema),
    defaultValues: {
      strengths: '',
      weaknesses: '',
      communications: '',
    },
  });

  const onSubmit = async (data: TTMExercisesSchema) => {
    console.log(data);
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('finished');
    }
  };

  const current = useMemo(() => {
    return Object.keys(form.getValues()).indexOf(Object.keys(form.getValues())[currentStep]);
  }, [currentStep, form]);

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      header={
        <Header rightContent={<DateBadge date={deadline} />}>
          <CarouselPagination
            steps={steps}
            currentStep={Object.keys(form.getValues()).indexOf(
              Object.keys(form.getValues())[currentStep],
            )}
          />
        </Header>
      }
      footer={
        <Button variant="purple" className="mx-auto" onClick={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
      }>
      <section className="flex flex-col gap-4 h-full w-full flex-1 ">
        <p className="text-center text-xl ">
          {t.rich('desc', {
            stage: t(`stages.strengths`),
            bold: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <FormField
              control={form.control}
              name={`strengths`}
              render={({field}) => (
                <FormItem className="flex flex-col flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="240-480 characters *"
                      className="flex-grow resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>
      {/* <Carousel className="h-full w-full flex-1 bg-blue" setApi={setApi}>
        <CarouselContent className="bg-red ">
          <CarouselItem>

          </CarouselItem>
        </CarouselContent>
      </Carousel> */}
    </PageLayout>
  );
};
