import React, {FC} from 'react';

export const EditTeam: FC<React.SVGProps<SVGSVGElement>> = ({
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
        d="M10 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M21.7001 16.4001L20.8 16.1001M15.2 13.9001L14.3 13.6001M16.6001 18.7001L16.9001 17.8M19.1001 12.2L19.4001 11.3M19.6 18.7L19.2 17.7M16.7999 12.3L16.3999 11.3M14.3 16.6L15.3 16.2M20.7 13.7999L21.7 13.3999M21 15C21 16.6569 19.6569 18 18 18C16.3431 18 15 16.6569 15 15C15 13.3431 16.3431 12 18 12C19.6569 12 21 13.3431 21 15ZM13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
