'use client';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {useExerciseStore} from '@/store/exerciseStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {DialogTitle} from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {format} from 'date-fns';
import {CalendarClock, Calendar as CalendarIcon, Save} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Dialog, DialogContent, DialogTrigger} from '../ui';
import {Calendar} from '../ui/calendar/calendar';

const formSchema = z.object({
  writingDate: z.date(),
  reviewingDate: z.date(),
});

export const DeadlineForm = () => {
  const t = useTranslations();
  const {deadline, setDeadline} = useExerciseStore();
  const [writingDialogOpen, setWritingDialogOpen] = useState(false);
  const [reviewingDialogOpen, setReviewingDialogOpen] = useState(false);
  const [reviewingTime, setReviewingTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [writingTime, setWritingTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  // Safely create Date objects from potentially invalid values
  const safeDate = (date: Date | null | undefined): Date => {
    if (!date) return new Date();

    // Check if the date is valid
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      writingDate: safeDate(deadline.writingPhase),
      reviewingDate: safeDate(deadline.reviewingPhase),
    },
  });

  const combineDateTime = (date: Date, timeStr: string) => {
    try {
      if (!date || isNaN(date.getTime())) {
        console.error('Invalid date provided to combineDateTime');
        return new Date();
      }

      const [hours, minutes] = timeStr.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0, minutes || 0);
      return newDate;
    } catch (error) {
      console.error('Error combining date and time:', error);
      return new Date(); // Return current date if there's an error
    }
  };

  const isInPast = (date: Date) => {
    try {
      const now = new Date();
      return date < new Date(now.setHours(0, 0, 0, 0));
    } catch (error) {
      console.error('Error checking if date is in past:', error);
      return false;
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="writingDate"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2 ">
              <FormLabel className="text-xl font-bold font-roboto ">
                {t('exercises.deadline.writingPhase')}
              </FormLabel>
              <FormControl>
                <Dialog open={writingDialogOpen} onOpenChange={setWritingDialogOpen}>
                  <VisuallyHidden.Root>
                    <DialogTitle> {t('exercises.deadline.writingPhase')}</DialogTitle>
                  </VisuallyHidden.Root>
                  <DialogTrigger asChild>
                    <Button variant="pink" className="w-full">
                      <CalendarClock size={22} className="text-black" />
                      {(() => {
                        try {
                          const dateToFormat = field.value ?? deadline.writingPhase;
                          if (dateToFormat && !isNaN(new Date(dateToFormat).getTime())) {
                            return format(dateToFormat, 'PP HH:mm');
                          }
                          return t('exercises.deadline.pickADateAndTime');
                        } catch (error) {
                          console.error('Error formatting date:', error);
                          return t('exercises.deadline.pickADateAndTime');
                        }
                      })()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen" className="flex flex-col gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={18} className="text-black" />
                      <p>{t('exercises.deadline.pickADate')}</p>
                    </div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={isInPast}
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={writingTime}
                      onChange={(e) => setWritingTime(e.target.value)}
                    />
                    <Button
                      variant="green"
                      className="h-fit mx-auto"
                      disabled={isInPast(combineDateTime(field.value, writingTime))}
                      onClick={() => {
                        if (field.value) {
                          field.onChange(combineDateTime(field.value, writingTime));
                          setDeadline({
                            writingPhase: combineDateTime(field.value, writingTime),
                            reviewingPhase: deadline.reviewingPhase,
                          });
                        }
                        setWritingDialogOpen(false);
                      }}>
                      {t('common.save')} <Save size={22} />
                    </Button>
                  </DialogContent>
                </Dialog>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reviewingDate"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-xl font-bold font-roboto">
                {t('exercises.deadline.reviewingPhase')}
              </FormLabel>
              <FormControl>
                <Dialog open={reviewingDialogOpen} onOpenChange={setReviewingDialogOpen}>
                  <VisuallyHidden.Root>
                    <DialogTitle> {t('exercises.deadline.reviewingPhase')}</DialogTitle>
                  </VisuallyHidden.Root>
                  <DialogTrigger asChild>
                    <Button variant="blue" className="w-full">
                      <CalendarClock size={22} className="text-black" />
                      {(() => {
                        try {
                          const dateToFormat = field.value ?? deadline.reviewingPhase;
                          if (dateToFormat && !isNaN(new Date(dateToFormat).getTime())) {
                            return format(dateToFormat, 'PP HH:mm');
                          }
                          return t('exercises.deadline.pickADateAndTime');
                        } catch (error) {
                          console.error('Error formatting date:', error);
                          return t('exercises.deadline.pickADateAndTime');
                        }
                      })()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    size="fullscreen"
                    aria-describedby={undefined}
                    className="flex flex-col gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={18} className="text-black" />
                      <p>{t('exercises.deadline.pickADate')}</p>
                    </div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={isInPast}
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={reviewingTime}
                      onChange={(e) => setReviewingTime(e.target.value)}
                    />
                    <Button
                      variant="green"
                      className="h-fit mx-auto"
                      disabled={
                        combineDateTime(form.getValues('writingDate') ?? new Date(), writingTime) >
                        combineDateTime(
                          form.getValues('reviewingDate') ?? new Date(),

                          reviewingTime,
                        )
                      }
                      onClick={() => {
                        if (field.value) {
                          field.onChange(combineDateTime(field.value, reviewingTime));
                          setDeadline({
                            writingPhase: deadline.writingPhase,
                            reviewingPhase: combineDateTime(field.value, reviewingTime),
                          });
                        }
                        setReviewingDialogOpen(false);
                      }}>
                      {t('common.save')} <Save size={22} />
                    </Button>
                  </DialogContent>
                </Dialog>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
