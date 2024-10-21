import React, {FC} from 'react';

export const Eyes2: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 45,
  width = 40,

  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="0.53418" y="1.11084" width="18.915" height="35.2192" fill="white" stroke="black" />
      <rect
        x="5.7749"
        y="6.677"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect x="20.4487" y="1.11084" width="18.915" height="35.2192" fill="white" stroke="black" />
      <path
        d="M23.6175 38.811C23.6175 45.8212 15.7563 45.8212 15.7563 38.811"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="25.5352"
        y="6.85693"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
