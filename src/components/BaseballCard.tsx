'use client';
import {BaseballCardType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {FC} from 'react';
import {AvatarCharacter} from './icons/avatar-character';
import {Avatar, AvatarFallback} from './ui/avatar';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

export const BaseballCard: FC<BaseballCardType> = ({member, onOpenChange, children, open}) => {
  return (
    <Collapsible
      className={cn(
        member.role.includes('facilitator') ? 'bg-pink' : 'bg-yellow',
        ' py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 h-fit',
      )}
      open={open}
      onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="w-full">
        <div className="items-center w-full flex flex-col gap-4">
          <Avatar className="w-16 h-16 relative bg-white">
            <AvatarFallback>
              <AvatarCharacter />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold">{`${member.first_name} ${member.last_name}`}</p>
            <p>{member.role}</p>
          </div>
        </div>
      </CollapsibleTrigger>

      {children && (
        <CollapsibleContent>
          <div className=" gap-2 flex flex-col ">{children}</div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};
