'use client';

import {Button} from '@/components/ui/calendar/button';
import {Calendar} from '@/components/ui/calendar/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/calendar/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import * as React from 'react';
import {TimePicker} from './TimePicker';

export function DateAndTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [hours, setHours] = React.useState<string>('');
  const [minutes, setMinutes] = React.useState<string>('');
  console.log(date);
  console.log(hours);
  console.log(minutes);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date and time</span>}
          {hours && minutes && (
            <span>
              , {hours}:{minutes}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        <TimePicker hours={hours} setHours={setHours} minutes={minutes} setMinutes={setMinutes} />
      </PopoverContent>
    </Popover>
  );
}
