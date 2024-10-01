import React, {FC} from 'react';
import {Button} from './ui';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {cn} from '@/lib/utils';
import {ExerciseCardType} from '@/lib/types';

export const ExerciseCard: FC<ExerciseCardType> = ({
  title,
  subtitle,
  description,
  button,
  link,
}) => {
  return (
    <div className={cn('flex max-w-sm flex-col space-y-6 bg-purple p-6 pb-8')}>
      <div className="space-y-1">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p className="text-sm font-light">{subtitle}</p>
      </div>
      <p>{description}</p>
      <Button variant="white" asChild className="mx-auto">
        <Link href={link}>
          {button}
          <ArrowRight size={32} />
        </Link>
      </Button>
    </div>
  );
};
