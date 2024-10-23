'use client';

import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import * as React from 'react';

import {Button} from '@/components/ui/calendar/button';
import {Calendar} from '@/components/ui/calendar/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/calendar/popover';
import {cn} from '@/lib/utils';

export function DateAndTimePicker() {
  const [date, setDate] = React.useState<Date>();

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
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
