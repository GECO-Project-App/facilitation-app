import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar8: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 94,
  width = 86,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width="86"
      height="94"
      viewBox="0 0 86 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 58.6142V58.1384L52.4142 58.1148C62.5601 57.6108 70.7701 49.6512 71.7647 39.5447L71.8091 39.0937H72.2623H74.9878C80.7894 39.0937 85.5 34.3474 85.5 28.4832C85.5 22.6191 80.7894 17.8728 74.9878 17.8728H71.4056H71.0376L70.9282 17.5214C68.3178 9.13604 60.5548 3.05884 51.3902 3.05884H34.6098C25.4452 3.05884 17.6822 9.13604 15.0718 17.5214L14.9624 17.8728H14.5944H11.0122C5.21065 17.8728 0.5 22.6191 0.5 28.4832C0.5 34.3474 5.21065 39.0937 11.0122 39.0937H13.7377H14.1909L14.2353 39.5447C15.2299 49.6512 23.4399 57.6108 33.5858 58.1148L34.061 58.1384V58.6142V93H51.939V58.6142Z"
        fill={fill}
        stroke="black"
      />
      <rect x="12.5" y="0.5" width="30" height="46" rx="15" fill="white" stroke="black" />
      <rect x="12.5" y="3.5" width="23" height="32" rx="11.5" fill="black" stroke="black" />
      <rect x="43.5" y="0.5" width="30" height="46" rx="15" fill="white" stroke="black" />
      <rect x="43.5" y="3.5" width="23" height="32" rx="11.5" fill="black" stroke="black" />
      <path
        d="M46.6175 52C46.6175 59.0102 38.7563 59.0102 38.7563 52"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
