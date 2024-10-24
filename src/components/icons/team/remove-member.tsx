import React, {FC} from 'react';

export const RemoveMember: FC<React.SVGProps<SVGSVGElement>> = ({
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
        d="M16.25 21V19C16.25 17.9391 15.8286 16.9217 15.0784 16.1716C14.3283 15.4214 13.3109 15 12.25 15H6.25C5.18913 15 4.17172 15.4214 3.42157 16.1716C2.67143 16.9217 2.25 17.9391 2.25 19V21M22.25 11H16.25M13.25 7C13.25 9.20914 11.4591 11 9.25 11C7.04086 11 5.25 9.20914 5.25 7C5.25 4.79086 7.04086 3 9.25 3C11.4591 3 13.25 4.79086 13.25 7Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
