import React, {FC} from 'react';

export const Pause: FC<React.SVGProps<SVGSVGElement>> = ({height = 50, width = 50}) => {
  return (
    <svg width={width} height={height} viewBox="18 24 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="45.8335"
        y="37"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="32"
        y="37"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="45.8335"
        y="35"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="32"
        y="35"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="45.8335"
        y="35"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="#FC5555"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="32"
        y="35"
        width="8.375"
        height="25.6667"
        rx="4.1875"
        fill="#FC5555"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};