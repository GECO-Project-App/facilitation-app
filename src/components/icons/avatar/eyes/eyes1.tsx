import React, {FC} from 'react';

export const Eyes1: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 44,
  width = 40,

  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.53418"
        y="0.5"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="5.7749"
        y="6.06628"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="20.4487"
        y="0.5"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <path
        d="M23.6175 38.2002C23.6175 45.2104 15.7563 45.2104 15.7563 38.2002"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="25.5352"
        y="6.24609"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
