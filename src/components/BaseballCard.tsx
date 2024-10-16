'use client';
import {cn} from '@/lib/utils';
import {FC} from 'react';
import {AvatarCharacter} from './icons/avatar-character';
import {Avatar, AvatarFallback} from './ui/avatar';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

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
    <Collapsible
      className={cn(
        bgColor,
        ' py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 w-full px-4 h-fit',
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
        <div>
          {['Strength', 'Weakness', 'Communication Style', 'Skills Assessment'].map(
            (item, index) => (
              <p key={index}>
                <span className="font-light">{item}:</span>
              </p>
            ),
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
