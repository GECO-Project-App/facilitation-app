'use client';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {useEffect, useState} from 'react';
import {Tables} from '../../database.types';
import {DefaultProfileImage} from './icons';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';

export const ProfileAvatar = ({
  memberProfile,
  size = 'sm',
}: {
  memberProfile: Tables<'team_members'>;
  size?: 'sm' | 'lg';
}) => {
  const {downloadImage} = useUserStore();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  console.log(memberProfile?.avatar_url);
  useEffect(() => {
    async function getImage(path: string) {
      const url = await downloadImage(path);
      setAvatarUrl(url ?? '');
    }

    if (memberProfile?.avatar_url) getImage(memberProfile.avatar_url);
  }, [memberProfile?.avatar_url, downloadImage]);

  if (!memberProfile) return null;
  return (
    <Avatar
      className={cn(
        'relative bg-white aspect-square mx-auto p-2',
        size === 'sm' ? 'w-16 h-16' : 'w-32 h-32',
      )}>
      <AvatarImage
        src={avatarUrl}
        alt={`${memberProfile?.first_name} ${memberProfile?.last_name}`}
      />
      {memberProfile?.first_name?.[0] && memberProfile?.last_name?.[0] ? (
        <AvatarFallback className="bg-transparent">{`${memberProfile.first_name[0]}${memberProfile.last_name[0]}`}</AvatarFallback>
      ) : (
        <AvatarFallback>
          <DefaultProfileImage />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
