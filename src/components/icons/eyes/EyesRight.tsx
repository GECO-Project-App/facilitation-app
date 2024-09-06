import React, {FC} from 'react';

export const EyesRight: FC<React.SVGProps<SVGSVGElement>> = ({height = 32, width = 32}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1.5"
        y="1.5"
        width="15"
        height="26"
        rx="7.5"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <rect
        x="7.5"
        y="6.5"
        width="9"
        height="15"
        rx="4.5"
        fill="black"
        stroke="black"
        strokeWidth="3"
      />
      <rect
        x="19.5"
        y="1.5"
        width="15"
        height="26"
        rx="7.5"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <rect
        x="25.5"
        y="6.5"
        width="9"
        height="15"
        rx="4.5"
        fill="black"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
};
