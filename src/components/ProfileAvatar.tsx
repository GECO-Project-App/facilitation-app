import {Tables} from '../../database.types';
import {DefaultProfileImage} from './icons';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';

export const ProfileAvatar = ({memberProfile}: {memberProfile: Tables<'team_members'>}) => {
  return (
    <Avatar className="w-32 h-32 relative bg-white aspect-square mx-auto">
      <AvatarImage
        src={memberProfile?.avatar_url ?? ''}
        alt={`${memberProfile.first_name} ${memberProfile.last_name}`}
      />
      {memberProfile?.first_name?.[0] && memberProfile?.last_name?.[0] ? (
        <AvatarFallback>{`${memberProfile.first_name[0]}${memberProfile.last_name[0]}`}</AvatarFallback>
      ) : (
        <AvatarFallback>
          <DefaultProfileImage />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
