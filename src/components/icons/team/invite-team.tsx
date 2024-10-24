import React, {FC} from 'react';

export const InviteTeam: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 24,
  width = 24,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M16.625 21V19C16.625 17.9391 16.2036 16.9217 15.4534 16.1716C14.7033 15.4214 13.6859 15 12.625 15H6.625C5.56413 15 4.54672 15.4214 3.79657 16.1716C3.04643 16.9217 2.625 17.9391 2.625 19V21M19.625 8V14M22.625 11H16.625M13.625 7C13.625 9.20914 11.8341 11 9.625 11C7.41586 11 5.625 9.20914 5.625 7C5.625 4.79086 7.41586 3 9.625 3C11.8341 3 13.625 4.79086 13.625 7Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
