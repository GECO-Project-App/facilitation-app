'use client';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CalendarClock} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Dialog, DialogContent, DialogTrigger} from '../ui';
import {Calendar} from '../ui/calendar/calendar';

const formSchema = z.object({
  writingDate: z.date(),
  reviewingDate: z.date(),
});

export const DeadlineForm = () => {
  const t = useTranslations('exercises.deadline');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('onSubmit', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="writingDate"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2 ">
              <FormLabel className="text-xl font-bold font-roboto ">{t('writingPhase')}</FormLabel>
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="pink">
                      <CalendarClock size={22} className="text-black" />
                      {t('pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      //   selected={mode === 'writing' ? writingDate : reviewingDate}
                      //   onSelect={(date) => selectedDate(date as Date)}
                      initialFocus
                    />
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
              <FormLabel className="text-xl font-bold font-roboto">{t('reviewingPhase')}</FormLabel>
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="blue">
                      <CalendarClock size={22} className="text-black" />
                      {t('pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      //   selected={mode === 'writing' ? writingDate : reviewingDate}
                      //   onSelect={(date) => selectedDate(date as Date)}
                      initialFocus
                    />
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
