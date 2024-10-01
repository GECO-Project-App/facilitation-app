import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const SvFlag: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 23,
  width = 23,
  strokeWidth = 0.5,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_568_406"
        style={{maskType: 'alpha'}}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="23"
        height="23">
        <rect
          x="1.17917"
          y="1.22046"
          width="20"
          height="20"
          rx="10"
          fill="#0CAC56"
          stroke="black"
          strokeWidth={strokeWidth}
        />
      </mask>
      <g mask="url(#mask0_568_406)">
        <path d="M-4.45331 1.06311H32.6715V21.1881H-4.45331V1.06311Z" fill="#5553FE" />
        <path d="M11.8346 1.05908H7.19287V21.1841H11.8346V1.05908Z" fill="#FDDE39" />
        <path d="M32.6947 9.11072H-4.45331V13.1567H32.6947V9.11072Z" fill="#FDDE39" />
        <rect
          x="1.17917"
          y="1.22046"
          width="20"
          height="20"
          rx="10"
          stroke="black"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
