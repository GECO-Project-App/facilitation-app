'use client';

import {Button} from '@/components/ui/button/button';
import {Calendar} from '@/components/ui/calendar/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/calendar/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {CalendarClock} from 'lucide-react';
import * as React from 'react';
import {TimePicker} from './TimePicker';

export function DateAndTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [hours, setHours] = React.useState<string>('');
  const [minutes, setMinutes] = React.useState<string>('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="purple"
          className={cn(
            'w-full justify-start text-left font-normal text-lg',
            !date && 'text-muted-foreground',
          )}>
          <CalendarClock size={24} className="text-black" />
          {date ? format(date, 'PPP') : <span className="text-black">Pick a date and time</span>}
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
