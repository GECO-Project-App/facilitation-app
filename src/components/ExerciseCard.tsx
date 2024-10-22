import {ExerciseCardType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
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
    <div className={cn(background, 'flex flex-col space-y-6 p-6 pb-8')}>
      <div className="space-y-1">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p className="font-light">{subtitle}</p>
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
