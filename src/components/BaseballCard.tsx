'use client';
import {BaseballCardType} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
import {ProfileAvatar} from './ProfileAvatar';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from './ui/collapsible';

export const BaseballCard: FC<BaseballCardType> = ({member, onOpenChange, children, open}) => {
  const t = useTranslations('common');

  return (
    <Collapsible
      className={cn(
        member.role.includes('facilitator') ? 'bg-yellow' : 'bg-pink',
        'py-6 rounded-4xl border-2 border-black flex flex-col items-center space-y-4 h-fit',
      )}
      open={open}
      onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={cn('w-full')}>
        <div className="items-center w-full flex flex-col gap-4">
          <ProfileAvatar memberProfile={member} />
          <div className="text-center">
            <p className="font-bold">{`${member.profile_name}`}</p>
            <p>{t(member.role)}</p>
          </div>
        </div>
      </CollapsibleTrigger>

      {children && (
        <CollapsibleContent>
          <div className="gap-2 flex flex-col">{children}</div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};
