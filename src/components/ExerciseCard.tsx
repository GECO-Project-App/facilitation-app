import {Link} from '@/i18n/routing';
import {ExerciseCardType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {ArrowRight, Rocket} from 'lucide-react';
import {FC, useMemo} from 'react';
import {Button} from './ui';

export const ExerciseCard: FC<ExerciseCardType> = ({
  title,
  subtitle,
  description,
  button,
  link,
  type,
}) => {
  const background: string = useMemo(() => {
    switch (type) {
      case 'check-in':
        return 'bg-purple';
      case 'check-out':
        return 'bg-green';
      case 'ssc':
        return 'bg-orange';
      case 'tutorial-to-me':
        return 'bg-red';
    }
  }, [type]);

  return (
    <div
      className={cn(background, 'flex flex-col gap-6 p-6 pb-8 border-2 border-black rounded-4xl')}>
      <div className="space-y-1">
        <div className="flex flex-row items-center gap-4">
          <Rocket size={24} />
          <h4 className="text-2xl font-bold">{title}</h4>
        </div>
        <p className="font-light">{subtitle}</p>
      </div>
      <p>{description}</p>
      <Button variant="white" asChild size="small" className="w-full !text-lg">
        <Link href={link}>
          {button}
          <ArrowRight size={24} />
        </Link>
      </Button>
    </div>
  );
};
