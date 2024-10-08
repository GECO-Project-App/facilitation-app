import React, { FC } from 'react';

interface FooterWrapperProps {
  children: React.ReactNode;
  backgroundColor: string;
}
const FooterWrapper: FC<FooterWrapperProps> = ({ children, backgroundColor }) => {

    return (
    <footer className={`flex justify-center items-center p-4 w-full fixed bottom-0 h-32 ${backgroundColor}`}>
      {children}
    </footer>
  );
};

export default FooterWrapper;
