'use client';
import {ShapeColors} from '@/lib/constants';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';

export const AvatarColorPicker = ({onColorSelect}: {onColorSelect: (color: string) => void}) => {
  const {avatar, setAvatar} = useUserStore();

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {Object.entries(ShapeColors).map(([colorName, colorValue]) => (
        <button
          key={colorName}
          className={cn(
            avatar.color === colorValue ? 'scale-110 border-[3px]' : 'border scale-95',
            'aspect-square w-11 rounded-full  border-black animation-transition ',
          )}
          style={{backgroundColor: colorValue}}
          onClick={() => {
            setAvatar({color: colorValue, shape: avatar.shape});
            onColorSelect(colorValue);
          }}
          aria-label={`Pick ${colorName} color`}>
          <span className="sr-only">{colorName}</span>
        </button>
      ))}
    </div>
  );
};
