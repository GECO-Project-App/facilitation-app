'use client';
import {ExerciseCardType, UserTeamExercises} from '@/lib/types';
import {cn, getExerciseColor} from '@/lib/utils';
import {ArrowRight} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';
import {FC, useMemo} from 'react';
import {TeamAvatars} from './TeamAvatars';
import {Button} from './ui';

type ActivityItemProps = {
  activity: UserTeamExercises;
};

export const ActivityItem: FC<ActivityItemProps> = ({activity}) => {
  const format = useFormatter();
  const t = useTranslations();
  const catalogue: ExerciseCardType[] = t.raw('exerciseCatalogue.catalogue');

  const activityType = useMemo(() => {
    return catalogue.find((item) => item.type === activity.slug);
  }, [activity.slug, catalogue]);

  return (
    <div className={cn('border-b-2 border-x-2 border-black')}>
      <h3 className="text-center p-4 text-2xl font-bold bg-white border-b-2 border-black text-deepPurple">
        {format.dateTime(new Date(activity.deadline[`${activity.status}`]), {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })}
      </h3>
      <div className={cn(getExerciseColor(activity.slug), 'flex flex-col gap-6 p-4 pb-6')}>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{t(`common.slugs.${activity.slug}`)}</h3>
          <p className="font-light">{activityType?.subtitle}</p>
        </div>
        <p className="font-bold">
          Deadline:{' '}
          {format.dateTime(new Date(activity.deadline[`${activity.status}`]), {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          - {t(`common.status.${activity.status}`)}
        </p>

        <p>{activityType?.description}</p>
        <div className="flex h-9 w-fit gap-4 items-center justify-between whitespace-nowrap rounded-full border-2 border-black bg-white px-4 py-2 shadow-sm mx-auto">
          <p>{activity.team_name}</p>
        </div>
        <TeamAvatars />
        <Button variant="white" className="mx-auto">
          {t('common.letsStart')}
          <ArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
};
