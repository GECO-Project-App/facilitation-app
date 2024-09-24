import {cn} from '@/lib/utils';
import React, {FC} from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

const containerVariant = cva(
  'z-10 flex flex-row items-center rounded-full border-2 border-black uppercase font-bold text-xl gap-2 whitespace-nowrap justify-center w-40',
  {
    variants: {
      variant: {
        ghost: 'border-none ',
        default: 'bg-white text-red',
      },
      size: {
        default: 'pt-6 pb-4 pl-4 pr-4',
        icon: 'p-1 h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
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
