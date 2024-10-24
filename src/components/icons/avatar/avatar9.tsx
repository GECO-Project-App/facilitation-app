import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar9: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 85,
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
      viewBox="0 0 86 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 56.6142V56.1384L52.4142 56.1148C62.5601 55.6108 70.7701 47.6512 71.7647 37.5447L71.8091 37.0937H72.2623H74.9878C80.7894 37.0937 85.5 32.3474 85.5 26.4832C85.5 20.6191 80.7894 15.8728 74.9878 15.8728H71.4056H71.0376L70.9282 15.5214C68.3178 7.13604 60.5548 1.05884 51.3902 1.05884H34.6098C25.4452 1.05884 17.6822 7.13604 15.0718 15.5214L14.9624 15.8728H14.5944H11.0122C5.21065 15.8728 0.5 20.6191 0.5 26.4832C0.5 32.3474 5.21065 37.0937 11.0122 37.0937H13.7377H14.1909L14.2353 37.5447C15.2299 47.6512 23.4399 55.6108 33.5858 56.1148L34.061 56.1384V56.6142V84H51.939V56.6142Z"
        fill={fill}
        stroke="black"
      />
      <rect x="13.5" y="8.5" width="29" height="35" rx="14.5" fill="white" stroke="black" />
      <rect x="21.5" y="14.5" width="13" height="24" rx="6.5" fill="black" stroke="black" />
      <rect x="42.5" y="8.5" width="29" height="35" rx="14.5" fill="white" stroke="black" />
      <rect x="50.5" y="14.5" width="13" height="24" rx="6.5" fill="black" stroke="black" />
      <path
        d="M46.6175 43C46.6175 50.0102 38.7563 50.0102 38.7563 43"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
