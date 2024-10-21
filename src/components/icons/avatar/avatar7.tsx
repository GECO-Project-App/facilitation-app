import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar7: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 99,
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
      viewBox="0 0 86 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 63.6142V63.1384L52.4142 63.1148C62.5601 62.6108 70.7701 54.6512 71.7647 44.5447L71.8091 44.0937H72.2623H74.9878C80.7894 44.0937 85.5 39.3474 85.5 33.4832C85.5 27.6191 80.7894 22.8728 74.9878 22.8728H71.4056H71.0376L70.9282 22.5214C68.3178 14.136 60.5548 8.05884 51.3902 8.05884H34.6098C25.4452 8.05884 17.6822 14.136 15.0718 22.5214L14.9624 22.8728H14.5944H11.0122C5.21065 22.8728 0.5 27.6191 0.5 33.4832C0.5 39.3474 5.21065 44.0937 11.0122 44.0937H13.7377H14.1909L14.2353 44.5447C15.2299 54.6512 23.4399 62.6108 33.5858 63.1148L34.061 63.1384V63.6142V98H51.939V63.6142Z"
        fill={fill}
        stroke="black"
      />
      <rect x="23.5" y="0.5" width="19" height="56" rx="9.5" fill="white" stroke="black" />
      <rect x="28.5" y="0.5" width="9" height="40" rx="4.5" fill="black" stroke="black" />
      <rect x="43.5" y="0.5" width="19" height="56" rx="9.5" fill="white" stroke="black" />
      <path
        d="M46.6175 57C46.6175 64.0102 38.7563 64.0102 38.7563 57"
        stroke="black"
        strokeLinecap="round"
      />
      <rect x="48.5" y="0.5" width="8" height="39" rx="4" fill="black" stroke="black" />
    </svg>
  );
};
