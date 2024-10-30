import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar18: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 69,
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
      viewBox="0 0 86 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 56.7249V56.2492L52.4142 56.2256C62.5601 55.7215 70.7701 47.762 71.7647 37.6555L71.8091 37.2044H72.2623H74.9878C80.7894 37.2044 85.5 32.4582 85.5 26.594C85.5 20.7298 80.7894 15.9835 74.9878 15.9835H71.4056H71.0376L70.9282 15.6321C68.3178 7.24676 60.5548 1.16956 51.3902 1.16956H34.6098C25.4452 1.16956 17.6822 7.24676 15.0718 15.6321L14.9624 15.9835H14.5944H11.0122C5.21065 15.9835 0.5 20.7298 0.5 26.594C0.5 32.4582 5.21065 37.2044 11.0122 37.2044H13.7377H14.1909L14.2353 37.6555C15.2299 47.762 23.4399 55.7215 33.5858 56.2256L34.061 56.2492V56.7249V68.1107H51.939V56.7249Z"
        fill={fill}
        stroke="black"
      />
      <rect x="23.5" y="6.11072" width="19" height="8" rx="4" fill="white" stroke="black" />
      <rect x="28.5" y="7.11072" width="9" height="6" rx="3" fill="black" stroke="black" />
      <rect x="43.5" y="6.11072" width="19" height="8" rx="4" fill="white" stroke="black" />
      <path
        d="M46.6175 15.6107C46.6175 22.6209 38.7563 22.6209 38.7563 15.6107"
        stroke="black"
        strokeLinecap="round"
      />
      <rect x="48.5" y="7.11072" width="8" height="6" rx="3" fill="black" stroke="black" />
    </svg>
  );
};
