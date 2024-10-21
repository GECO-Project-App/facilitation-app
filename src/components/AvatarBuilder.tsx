'use client';
import {
  Avatar1,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
} from '@/components/icons/avatar';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {FC} from 'react';
import {AvatarColorPicker} from './AvatarColorPicker';

const avatars = [
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
  Avatar10,
  Avatar11,
  Avatar12,
];

export const AvatarBuilder: FC = () => {
  const {avatar, setAvatar} = useUserStore();

  return (
    <>
      <div className="grid grid-cols-3 gap-4 ">
        {avatars.map((AvatarItem, index) => (
          <button
            key={index}
            className={cn(
              avatar.shape === index ? 'bg-slate-100 ' : '',
              'flex justify-center items-center aspect-square border-black animation-transition rounded-full p-4 overflow-hidden',
            )}
            onClick={() => setAvatar({color: avatar.color, shape: index})}>
            <AvatarItem fill={avatar.color} height="100%" width="100%" className="aspect-square" />
          </button>
        ))}
      </div>
      <AvatarColorPicker onColorSelect={(color) => setAvatar({color, shape: avatar.shape})} />
    </>
  );
};
