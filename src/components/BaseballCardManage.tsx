'use client';
import {cn} from '@/lib/utils';
import {FC} from 'react';
import {AvatarCharacter} from './icons/avatar-character';
import {Avatar, AvatarFallback} from './ui/avatar';

type BaseballCardProps = {
  bgColor?: string;
  name: string;
  role: string[];
  children: React.ReactNode;
};

export const BaseballCardManage: FC<BaseballCardProps> = ({
  name,
  bgColor = 'bg-yellow',
  role = [],
  children,
}) => {
  return (
    <div
      className={cn(
        bgColor,
        ' py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 w-full px-4 h-fit',
      )}>
      <div className="items-center w-full flex flex-col gap-4">
        <Avatar className="w-16 h-16 relative bg-white">
          <AvatarFallback>
            <AvatarCharacter />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-bold">{name}</p>
          <p>{role.join('/')}</p>
        </div>
      </div>
      <div className="w-full gap-2 flex flex-col">{children}</div>
    </div>
  );
};
