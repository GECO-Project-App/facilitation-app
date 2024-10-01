import React, {FC} from 'react';

export const Constraints: FC<{children: React.ReactNode}> = ({children}) => {
  return <main className="mx-auto h-fit max-w-lg bg-red">{children}</main>;
};
