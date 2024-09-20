// components/StyledWrapper.tsx
import React, { FC, ReactNode } from 'react';

interface StyledWrapperProps {
  children: ReactNode;
}

const StyledWrapper: FC<StyledWrapperProps> = ({ children }) => {

  return (
    <main className="page-padding flex min-h-screen flex-col">
        {children}
    </main>
  )

};

export default StyledWrapper;
