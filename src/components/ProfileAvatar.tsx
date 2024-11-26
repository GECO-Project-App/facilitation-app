'use client';
import {createClient} from '@/lib/supabase/client';
import {cn} from '@/lib/utils';
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
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    async function downloadImage(path: string) {
      const supabase = createClient();
      try {
        const {data, error} = await supabase.storage.from('avatars').download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Error downloading image: ', error);
      }
    }
    if (memberProfile?.avatar_url) downloadImage(memberProfile.avatar_url);
  }, [memberProfile?.avatar_url]);

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
