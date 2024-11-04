import {useTeamStore} from '@/store/teamStore';
import {DefaultProfileImage} from './icons';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';

export const ProfileAvatar = () => {
  const {userProfile} = useTeamStore();

  if (!userProfile) return null;

  return (
    <Avatar className="w-16 h-16 relative bg-white">
      <AvatarImage
        src={userProfile.avatar_url}
        alt={`${userProfile.first_name} ${userProfile.last_name}`}
      />
      {userProfile?.first_name?.[0] && userProfile?.last_name?.[0] ? (
        <AvatarFallback>{`${userProfile.first_name[0]}${userProfile.last_name[0]}`}</AvatarFallback>
      ) : (
        <AvatarFallback>
          <DefaultProfileImage />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
