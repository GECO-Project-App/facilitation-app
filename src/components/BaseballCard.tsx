import {cn} from '@/lib/utils';
import {FC} from 'react';

type BaseballCardProps = {
  bgColor?: string;
  name: string;
  role: string[];
  avatar: string;
};

export const BaseballCard: FC<BaseballCardProps> = ({
  name,
  bgColor = 'bg-yellow',
  role = [],
  avatar,
}) => {
  return (
    <div className={cn(bgColor, 'p-4 rounded-lg')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center"></div>
      </div>
    </div>
  );
};
