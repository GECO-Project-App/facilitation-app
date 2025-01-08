'use client';

import {ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import * as React from 'react';
import {DayPicker} from 'react-day-picker';

import {buttonVariants} from '@/components/ui/button/button';
import {cn} from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({className, classNames, showOutsideDays = true, ...props}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('', className)}
      classNames={{
        months: 'flex flex-col flex-row space-x-4 space-y-0 ',
        month: 'space-y-4 ',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-xl font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({variant: 'noShadow'}),
          'h-8 p-0 opacity-50 hover:opacity-100 aspect-square',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-black/60 text-base rounded-md w-8 font-roboto font-semibold flex-1 ',
        row: 'flex w-full mt-2',
        cell: cn(
          'flex-1 aspect-square flex items-center justify-center',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          'h-8 md:h-12 w-auto font-normal aria-selected:opacity-100 text-lg md:text-xl rounded aspect-square active:bg-black/30 active:text-white',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: 'bg-black text-white',
        day_today: 'bg-green',
        day_outside:
          'day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'day-outside text-muted-foreground cursor-not-allowed',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({...props}) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({...props}) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export {Calendar};
