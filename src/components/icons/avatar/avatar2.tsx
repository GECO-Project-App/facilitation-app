import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar2: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 107,
  width = 86,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 86 107"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M51.939 64.0554V63.5796L52.4142 63.556C62.5601 63.0519 70.7701 55.0924 71.7647 44.9859L71.8091 44.5349H72.2623H74.9878C80.7894 44.5349 85.5 39.7886 85.5 33.9244C85.5 28.0602 80.7894 23.3139 74.9878 23.3139H71.4056H71.0376L70.9282 22.9626C68.3178 14.5772 60.5548 8.5 51.3902 8.5H34.6098C25.4452 8.5 17.6822 14.5772 15.0718 22.9626L14.9624 23.3139H14.5944H11.0122C5.21065 23.3139 0.5 28.0602 0.5 33.9244C0.5 39.7886 5.21065 44.5349 11.0122 44.5349H13.7377H14.1909L14.2353 44.9859C15.2299 55.0924 23.4399 63.0519 33.5858 63.556L34.061 63.5796V64.0554V106H51.939V64.0554Z"
        fill={fill}
        stroke="black"
      />
      <path
        d="M65.8546 5.57982C66.1726 5.31437 66.2174 4.83962 65.9546 4.51943C65.6918 4.19924 65.221 4.15486 64.903 4.4203L65.8546 5.57982ZM61.9192 8.86504L65.8546 5.57982L64.903 4.4203L60.9676 7.70552L61.9192 8.86504Z"
        fill="black"
      />
      <path
        d="M66.401 11.7643C66.8107 11.8259 67.1954 11.5442 67.2604 11.1351C67.3254 10.726 67.046 10.3445 66.6364 10.2829L66.401 11.7643ZM61.3315 11.0023L66.401 11.7643L66.6364 10.2829L61.5669 9.52089L61.3315 11.0023Z"
        fill="black"
      />
      <path
        d="M19.6639 5.57982C19.346 5.31437 19.3012 4.83962 19.564 4.51943C19.8268 4.19924 20.2976 4.15486 20.6155 4.4203L19.6639 5.57982ZM23.5994 8.86504L19.6639 5.57982L20.6155 4.4203L24.551 7.70552L23.5994 8.86504Z"
        fill="black"
      />
      <path
        d="M19.1175 11.7643C18.7079 11.8259 18.3232 11.5442 18.2582 11.1351C18.1932 10.726 18.4725 10.3445 18.8822 10.2829L19.1175 11.7643ZM24.187 11.0023L19.1175 11.7643L18.8822 10.2829L23.9517 9.52089L24.187 11.0023Z"
        fill="black"
      />
      <rect
        x="43.4487"
        y="0.5"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <path
        d="M46.6175 38.2002C46.6175 45.2104 38.7563 45.2104 38.7563 38.2002"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="48.5352"
        y="6.24609"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="23.5342"
        y="0.5"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="28.7749"
        y="6.06628"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
