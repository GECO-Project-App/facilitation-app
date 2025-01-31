import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {CalendarClock} from 'lucide-react';
import {useFormatter} from 'next-intl';
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from './ui';
import {Calendar} from './ui/calendar/calendar';

export const DateBadge = ({date}: {date: Date}) => {
  const format = useFormatter();

  return (
    <Dialog>
      <VisuallyHidden.Root>
        <DialogTitle>Deadline</DialogTitle>
      </VisuallyHidden.Root>
      <DialogTrigger asChild>
        <div className="bg-white rounded-full border-2 border-black w-fit gap-2 flex flex-row items-center  p-2">
          <CalendarClock size={20} />
          <div className="flex flex-col items-center">
            <p className="font-jetbrains_mono text-xs">
              {format.dateTime(date, {
                weekday: 'short',
                day: '2-digit',
              })}
            </p>
            <p className="font-jetbrains_mono text-xs">
              {format.dateTime(date, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent size="fullscreen" className="flex flex-col gap-4 md:gap-6">
        <Calendar
          mode="single"
          initialFocus
          selected={date}
          disabled={(day) => day.valueOf() !== date.valueOf()}
        />
      </DialogContent>
    </Dialog>
  );
};
