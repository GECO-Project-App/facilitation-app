import React, { FC, ReactNode } from 'react';

interface DescriptionWrapperProps {
  children: ReactNode;
}

const DescriptionWrapper: FC<DescriptionWrapperProps> = ({ children }) => {

  return (
    <p className="text-base px-6 font-jetbrains_mono font-bold">
        {children}
    </p>
  )

};

export default DescriptionWrapper;
