import React, {FC} from 'react';

export const Constraints: FC<{children: React.ReactNode}> = ({children}) => {
  return <main className="mx-auto max-w-lg">{children}</main>;
};
