import {cn} from '@/lib/utils';
import React, {FC} from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

const containerVariant = cva(
  'z-10 flex flex-row items-center rounded-full border-2 border-black uppercase font-bold text-xl gap-2 whitespace-nowrap justify-center w-fit',
  {
    variants: {
      variant: {
        icon: 'border-none ',
        ghost: 'border-none ',
        checkin: 'bg-pink hover:bg-black [&>*:not(svg)]:hover:bg-pink hover:text-white text-black',
        checkout:
          'bg-green hover:bg-black [&>*:not(svg)]:hover:bg-green hover:text-white text-black',
        pass: 'bg-blue hover:bg-black [&>*:not(svg)]:hover:bg-blue text-white',
        back: 'bg-yellow hover:bg-black [&>*:not(svg)]:hover:bg-yellow hover:text-white text-black',
      },
      size: {
        default: 'p-4',
        icon: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'checkin',
      size: 'default',
    },
  },
);

type StylizedContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariant>;

export const StylizedContainer: FC<StylizedContainerProps> = ({
  className,
  variant,
  size,
  children,
}) => {
  return (
    <div className="relative w-fit">
      <div className="absolute inset-0 translate-x-0 translate-y-2 transform rounded-full border-2 border-black bg-black" />

      <div className={cn(containerVariant({className, variant, size}), 'relative')}>{children}</div>
    </div>
  );
};
