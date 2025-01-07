'use client';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CalendarClock, Save} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Dialog, DialogContent, DialogTrigger} from '../ui';
import {Calendar} from '../ui/calendar/calendar';

const formSchema = z.object({
  writingDate: z.string().datetime({local: true}),
  reviewingDate: z.string().datetime({local: true}),
});

export const DeadlineForm = () => {
  const t = useTranslations();
  const [selected, setSelected] = useState<Date>();

  const [timeValue, setTimeValue] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
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
              <FormLabel className="text-xl font-bold font-roboto ">
                {t('exercises.deadline.writingPhase')}
              </FormLabel>
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="pink">
                      <CalendarClock size={22} className="text-black" />
                      {t('exercises.deadline.pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen">
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={(date) => setSelected(date as Date)}
                      initialFocus
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={timeValue}
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <Button variant="green" className="h-fit mx-auto">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="blue">
                      <CalendarClock size={22} className="text-black" />
                      {t('exercises.deadline.pickADateAndTime')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="fullscreen">
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={(date) => setSelected(date as Date)}
                      initialFocus
                    />
                    <input
                      type="time"
                      className="border-2 border-black w-fit rounded-md px-4 h-fit py-2 mx-auto"
                      value={timeValue}
                      onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <Button variant="green" className="h-fit mx-auto">
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
