'use client';
import {BaseballCardType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {FC} from 'react';
import {AvatarCharacter} from './icons/avatar-character';
import {Avatar, AvatarFallback} from './ui/avatar';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

export const BaseballCard: FC<BaseballCardType> = ({
  name,
  bgColor = 'bg-pink',
  role = [],
  avatar,
  children,
}) => {
  return (
    <Collapsible
      className={cn(
        bgColor,
        ' py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 h-fit',
      )}>
      <CollapsibleTrigger className="w-full">
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
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className=" gap-2 flex flex-col pb-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
