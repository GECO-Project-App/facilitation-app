'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {submitExerciseData} from '@/lib/actions/exerciseActions';
import {cn} from '@/lib/utils';
import {SSCBrainstormSchema, sscBrainstormSchema} from '@/lib/zodSchemas';
import {useExerciseStore} from '@/store/exerciseStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {FC, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Textarea} from './ui';

type SSCSwipeProps = {
  deadline: Date;
};

export const SSCSwipe: FC<SSCSwipeProps> = ({deadline}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations();
  const chapters = t.raw(`ssc.chapters`);
  const [stage, setStage] = useState<'start' | 'stop' | 'continue'>('start');
  const steps: string[] = t.raw(`exercises.ssc.${stage}.steps`).map((step: string) => step);
  const router = useRouter();
  const {toast} = useToast();
  const {setData} = useExerciseStore();
  const searchParams = useSearchParams();

  const form = useForm<SSCBrainstormSchema>({
    resolver: zodResolver(sscBrainstormSchema),
    defaultValues: {
      start: '',
      stop: '',
      continue: '',
    },
  });

  const onSubmit = async (data: SSCBrainstormSchema) => {
    const exerciseId = searchParams.get('id');
    if (!exerciseId) {
      console.error('Exercise ID not found in search params');
      return;
    }
    const stage = Object.keys(data).find(
      (key) => data[key as keyof SSCBrainstormSchema] === '',
    ) as keyof SSCBrainstormSchema;

    if (stage) {
      setStage(stage);
      setData(JSON.stringify(data));

      form.resetField(stage);
    } else {
      const {submission} = await submitExerciseData({exerciseId: exerciseId, data});
      if (submission) {
        toast({
          variant: 'success',
          title: t('exercises.toast.success'),
        });
        setData(null);
        router.push(`/exercises/ssc?id=${submission.exercise_id}`);
        router.refresh();
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
        <Header rightContent={<DateBadge date={deadline} />}>
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
          <Button variant="pink" className="mx-auto" onClick={form.handleSubmit(onSubmit)}>
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
        <p className="text-center text-xl ">
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
                      variant="default"
                      {...field}
                      {...form.register(stage, {required: true})}
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
      </div>
    </PageLayout>
  );
};
