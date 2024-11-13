'use client';
import {avatars} from '@/components/icons/avatar';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {FC, useState} from 'react';
import ReactDOMServer from 'react-dom/server';
import {AvatarColorPicker} from './AvatarColorPicker';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {Save} from './icons';
import {Button} from './ui/button';

export const AvatarBuilder: FC = () => {
  const {avatar, setAvatar, updateAvatar} = useUserStore();
  const [idx, setIdx] = useState<number | null>(null);
  const t = useTranslations('team.edit.avatar');
  return (
    <PageLayout
      header={<Header />}
      footer={
        <Button
          variant="green"
          onClick={() => {
            const AvatarComponent = avatars[idx ?? 0];

            const svgString = ReactDOMServer.renderToString(
              <AvatarComponent
                fill={avatar.color}
                height="100%"
                width="100%"
                className="aspect-square"
              />,
            );

            updateAvatar(svgString);
          }}>
          {t('button')} <Save />
        </Button>
      }>
      <section className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <p className="text-xl font-semibold text-center">Choose Your Avatar</p>

          <div className="grid grid-cols-3 lg:grid-cols-4 gap-0 ">
            {avatars.map((AvatarItem, index) => (
              <button
                key={index}
                className={cn(
                  idx === index ? 'bg-slate-100 border-black' : 'border-white',
                  'flex justify-center items-center aspect-square  animation-transition rounded-full p-4 overflow-hidden border',
                )}
                onClick={() => {
                  setIdx(index);
                }}>
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
    </PageLayout>
  );
};
