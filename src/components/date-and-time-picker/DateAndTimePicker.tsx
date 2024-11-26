'use client';

import {Button} from '@/components/ui/button/button';
import {Calendar} from '@/components/ui/calendar/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/calendar/popover';
import {cn} from '@/lib/utils';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {format} from 'date-fns';
import {CalendarClock} from 'lucide-react';
import {TimePicker} from './TimePicker';
export function DateAndTimePicker({
  btnText,
  variant,
  mode,
}: {
  btnText: string;
  variant: 'purple' | 'blue';
  mode: 'writing' | 'reviewing';
}) {
  const {setWritingDate, writingTime, setReviewingDate, reviewingTime, writingDate, reviewingDate} =
    useTutorialToMe();

  const selectedDate = (date: Date) => {
    console.log('Testing', date);
    if (mode === 'writing') {
      setWritingDate(date);
    } else if (mode === 'reviewing') {
      setReviewingDate(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            'w-full justify-start text-left font-normal text-md',
            !writingDate && !reviewingDate && 'text-muted-foreground',
          )}>
          <CalendarClock size={24} className="text-black" />
          {mode === 'writing' ? (
            writingDate ? (
              <>
                {format(writingDate, 'PPP')}
                {writingTime && ` ${writingTime}`}
              </>
            ) : (
              <span className="text-black">{btnText}</span>
            )
          ) : mode === 'reviewing' ? (
            reviewingDate ? (
              <>
                {format(reviewingDate, 'PPP')}
                {reviewingTime && ` ${reviewingTime}`}
              </>
            ) : (
              <span className="text-black">{btnText}</span>
            )
          ) : (
            <span className="text-black">{btnText}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={mode === 'writing' ? writingDate : reviewingDate}
          onSelect={(date) => selectedDate(date as Date)}
          initialFocus
        />
        <TimePicker mode={mode} />
      </PopoverContent>
    </Popover>
  );
}
