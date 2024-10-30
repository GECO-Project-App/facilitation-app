import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar6: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 100,
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
      viewBox="0 0 86 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 64.6142V64.1384L52.4142 64.1148C62.5601 63.6108 70.7701 55.6512 71.7647 45.5447L71.8091 45.0937H72.2623H74.9878C80.7894 45.0937 85.5 40.3474 85.5 34.4832C85.5 28.6191 80.7894 23.8728 74.9878 23.8728H71.4056H71.0376L70.9282 23.5214C68.3178 15.136 60.5548 9.05884 51.3902 9.05884H34.6098C25.4452 9.05884 17.6822 15.136 15.0718 23.5214L14.9624 23.8728H14.5944H11.0122C5.21065 23.8728 0.5 28.6191 0.5 34.4832C0.5 40.3474 5.21065 45.0937 11.0122 45.0937H13.7377H14.1909L14.2353 45.5447C15.2299 55.6512 23.4399 63.6108 33.5858 64.1148L34.061 64.1384V64.6142V99H51.939V64.6142Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="23.5342"
        y="1.05884"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="28.7749"
        y="6.62512"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="43.4487"
        y="1.05884"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <path
        d="M46.6175 38.759C46.6175 45.7692 38.7563 45.7692 38.7563 38.759"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="48.5352"
        y="6.80493"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
