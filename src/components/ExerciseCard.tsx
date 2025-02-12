import {Link} from '@/i18n/routing';
import {ExerciseCardType} from '@/lib/types';
import {cn, getExerciseColor} from '@/lib/utils';
import {ArrowRight, ScanFace, SmilePlus, Timer} from 'lucide-react';
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
  const Icon: React.ReactNode = useMemo(() => {
    switch (type) {
      case 'check-in':
        return <Timer size={24} />;
      case 'check-out':
        return <Timer size={24} />;
      case 'ssc':
        return <SmilePlus size={24} />;
      case 'ttm':
        return <ScanFace size={24} />;
    }
  }, [type]);

  return (
    <div
      className={cn(
        getExerciseColor(type),
        'flex flex-col gap-6 p-6 pb-8 border-2 border-black rounded-4xl',
      )}>
      <div className="space-y-1">
        <div className="flex flex-row items-center gap-4 ">
          {Icon}
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
