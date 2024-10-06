'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import {cn} from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({className, ...props}, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-4 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-backgrounddisabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green data-[state=unchecked]:bg-sky-300',
      className,
    )}
    {...props}
    ref={ref}>
      
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-20 w-40 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-40 data-[state=unchecked]:translate-x-[-3px] data-[state=checked]:bg-sky-300 data-[state=unchecked]:bg-green  border-4 border-black',
      )}
      />
    <div className="text-black text-2xl font-bold ml-6">Signup</div>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export {Switch};
