'use client';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {ImagePlus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Tables} from '../../database.types';
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
        'relative bg-white aspect-square mx-auto ',
        size === 'sm' ? 'w-16 h-16 p-1' : 'w-32 h-32 p-2',
      )}>
      <AvatarImage
        src={avatarUrl}
        alt={`${memberProfile?.first_name} ${memberProfile?.last_name}`}
        className="relative"
      />
      {memberProfile?.first_name?.[0] && memberProfile?.last_name?.[0] ? (
        <AvatarFallback className="bg-transparent">{`${memberProfile.first_name[0]}${memberProfile.last_name[0]}`}</AvatarFallback>
      ) : (
        <AvatarFallback>
          <ImagePlus size={24} />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
