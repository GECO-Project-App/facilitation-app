import {cn} from '@/lib/utils';
import {FC} from 'react';
import {Button} from './ui';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';

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
    <div
      className={cn(
        bgColor,
        'px-4 py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 w-full',
      )}>
      <Avatar className="w-16 h-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="font-bold">{name}</p>
        <p>{role.join('/')}</p>
      </div>
      <Button size="small" variant="white" className="w-full">
        Invite
      </Button>
    </div>
  );
};
