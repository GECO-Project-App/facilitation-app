import React, {FC, ReactNode} from 'react';

interface DescriptionWrapperProps {
  children: ReactNode;
}

const DescriptionWrapper: FC<DescriptionWrapperProps> = ({children}) => {
  return <p className="px-6 font-jetbrains_mono text-base font-bold">{children}</p>;
};

export default DescriptionWrapper;
