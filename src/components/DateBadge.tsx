import {CalendarClock} from 'lucide-react';
import {useFormatter} from 'next-intl';

export const DateBadge = ({date}: {date: Date}) => {
  const format = useFormatter();

  return (
    <div className="bg-white rounded-full border-2 border-black w-fit gap-2 flex flex-row items-center">
      <CalendarClock size={24} />
      {format.dateTime(date, {
        weekday: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </div>
  );
};
