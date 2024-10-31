'use client';

import {Button} from '@/components/ui/button/button';
import {Calendar} from '@/components/ui/calendar/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/calendar/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {CalendarClock} from 'lucide-react';
import * as React from 'react';
import {TimePicker} from './TimePicker';

export function DateAndTimePicker({
  btnText,
  variant,
}: {
  btnText: string;
  variant: 'purple' | 'blue';
}) {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            'w-full justify-start text-left font-normal text-md',
            !date && 'text-muted-foreground',
          )}>
          <CalendarClock size={24} className="text-black" />
          {date ? (
            <>
              {format(date, 'PPP')}
              {time && ` ${time}`}
            </>
          ) : (
            <span className="text-black">{btnText}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        <TimePicker time={time} setTime={setTime} />
      </PopoverContent>
    </Popover>
  );
}
