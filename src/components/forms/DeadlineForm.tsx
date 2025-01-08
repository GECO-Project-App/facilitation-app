'use client';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {DialogTitle} from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {format} from 'date-fns';
import {CalendarClock, Save} from 'lucide-react';
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
  const [writingDialogOpen, setWritingDialogOpen] = useState(false);
  const [reviewingDialogOpen, setReviewingDialogOpen] = useState(false);
  const [timeValue, setTimeValue] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('onSubmit', values);
  };

  const combineDateTime = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };

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
                  <DialogTrigger asChild>
                    <Button variant="pink" className="w-full">
                      <CalendarClock size={22} className="text-black" />
                      {field.value
                        ? format(field.value, 'PP HH:mm')
                        : t('exercises.deadline.pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={timeValue}
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <Button
                      variant="green"
                      className="h-fit mx-auto"
                      onClick={() => {
                        if (field.value) {
                          field.onChange(combineDateTime(field.value, timeValue));
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
                      {field.value
                        ? format(field.value, 'PP HH:mm')
                        : t('exercises.deadline.pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen" aria-describedby={undefined}>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => {
                        const writingDate = form.getValues('writingDate');
                        return writingDate ? date < writingDate : false;
                      }}
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={timeValue}
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <Button
                      variant="green"
                      className="h-fit mx-auto text-sm"
                      onClick={() => {
                        if (field.value) {
                          field.onChange(combineDateTime(field.value, timeValue));
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
