'use client';
import {
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
  Avatar2,
  Avatar20,
  Avatar21,
  Avatar22,
  Avatar23,
  Avatar24,
  Avatar25,
  Avatar26,
  Avatar27,
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
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
  Avatar20,
  Avatar21,
  Avatar22,
  Avatar23,
  Avatar24,
  Avatar25,
  Avatar26,
  Avatar27,
];

export const AvatarBuilder: FC = () => {
  const {avatar, setAvatar} = useUserStore();

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <p className="text-xl font-semibold text-center">Choose Your Avatar</p>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 ">
          {avatars.map((AvatarItem, index) => (
            <button
              key={index}
              className={cn(
                avatar.shape === index ? 'bg-slate-100 border-black' : 'border-white',
                'flex justify-center items-center aspect-square  animation-transition rounded-full p-4 overflow-hidden border',
              )}
              onClick={() => setAvatar({color: avatar.color, shape: index})}>
              <AvatarItem
                fill={avatar.color}
                height="100%"
                width="100%"
                className="aspect-square"
              />
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <p className="text-xl font-semibold">Skin Tone</p>
        <AvatarColorPicker onColorSelect={(color) => setAvatar({color, shape: avatar.shape})} />
      </section>
    </section>
  );
};
