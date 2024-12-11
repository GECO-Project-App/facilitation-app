'use client';
import {useToast} from '@/hooks/useToast';
import {Link, useRouter} from '@/i18n/routing';
import {joinTeamSchema, JoinTeamSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {CarouselPagination} from './CarouselPagination';
import {Header} from './Header';
import {Complete} from './icons';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input, Progress} from './ui';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from './ui/carousel';

export const SSCSwipe: FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations();
  const steps: string[] = t.raw('exercises.passItOn.steps').map((step: string) => step);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<JoinTeamSchema>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      code: '',
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

  const onSubmit = async (data: JoinTeamSchema) => {
    console.log(data);
  };

  return (
    <PageLayout
      backgroundColor="bg-blue"
      header={
        <Header>
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
          <Button variant="yellow" className="mx-auto" asChild>
            <Link href="/">Submut</Link>
          </Button>
        )
      }>
      <div className="flex flex-col gap-4 h-full w-full  flex-1 ">
        <div className="flex flex-row items-center justify-between h-fit gap-2 ">
          <button className=" px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black   bg-yellow">
            Start
          </button>
          <button className=" px-6 py-1 rounded-full font-semibold  text-lg md:text-2xl border-2 border-black bg-red ">
            Stop
          </button>
          <button className=" px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black bg-green ">
            Continue
          </button>
        </div>
        <Progress value={currentStep / steps.length} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 bg-green flex-1">
            <Carousel className="h-full w-full flex-1 bg-pink" setApi={setApi}>
              <CarouselContent className="">
                <CarouselItem>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input type="text" {...field} placeholder={t('tabs.code')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CarouselItem>
                <CarouselItem>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input type="text" {...field} placeholder={t('tabs.code')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};
