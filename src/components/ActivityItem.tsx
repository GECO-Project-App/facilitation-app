import {UserTeamExercises} from '@/lib/types';
import {cn} from '@/lib/utils';
import {ArrowRight} from 'lucide-react';
import {useFormatter} from 'next-intl';
import {FC} from 'react';
import {TeamAvatars} from './TeamAvatars';
import {Button} from './ui';

type ActivityItemProps = {
  hasBottomBorder: boolean;
  activity: UserTeamExercises;
};

export const ActivityItem: FC<ActivityItemProps> = ({hasBottomBorder, activity}) => {
  const format = useFormatter();

  return (
    <div className={cn(hasBottomBorder ? 'border-b-2' : '', 'border-t-2 border-x-2 border-black')}>
      <h3 className="text-center p-4 text-2xl font-bold bg-white border-b-2 border-black text-deepPurple">
        {format.dateTime(new Date(activity.deadline[`${activity.status}`]), {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })}
      </h3>
      <div className="flex flex-col gap-6 p-4 pb-6 bg-purple">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{activity.slug}</h3>
          <p className="font-light">5-15 minutes | 2-20 members</p>
        </div>
        <p className="font-bold">
          Deadline:{' '}
          {format.dateTime(new Date(activity.deadline[`${activity.status}`]), {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          - {activity.status}
        </p>
        <p>
          Start your meetings right by giving each team member the space to share something with the
          team.
        </p>
        <TeamAvatars />
        <Button variant="white" className="mx-auto">
          Start
          <ArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
};
