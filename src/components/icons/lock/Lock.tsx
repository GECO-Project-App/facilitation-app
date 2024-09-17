import React, {FC} from 'react';

export const Lock: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 18,
  width = 16,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="6" width="16" height="12" rx="2" fill="black" />
      <path
        d="M4 4C4 2.34315 5.34315 1 7 1H9C10.6569 1 12 2.34315 12 4V9H4V4Z"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="8" cy="11" r="2" fill="white" />
      <rect x="7" y="10" width="2" height="5" rx="1" fill="white" />
    </svg>
  );
};
