import {CalendarClock} from 'lucide-react';
import {useFormatter} from 'next-intl';

export const DateBadge = ({date}: {date: Date}) => {
  const format = useFormatter();

  return (
    <div className="bg-white rounded-full border-2 border-black w-fit gap-2 flex flex-row items-center  p-2">
      <CalendarClock size={24} />
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
  );
};
