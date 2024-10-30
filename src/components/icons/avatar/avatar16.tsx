import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar16: FC<React.SVGProps<SVGSVGElement>> = ({
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
        d="M51.939 56.6662V56.1904L52.4142 56.1668C62.5601 55.6628 70.7701 47.7032 71.7647 37.5967L71.8091 37.1457H72.2623H74.9878C80.7894 37.1457 85.5 32.3994 85.5 26.5353C85.5 20.6711 80.7894 15.9248 74.9878 15.9248H71.4056H71.0376L70.9282 15.5734C68.3178 7.18804 60.5548 1.11084 51.3902 1.11084H34.6098C25.4452 1.11084 17.6822 7.18804 15.0718 15.5734L14.9624 15.9248H14.5944H11.0122C5.21065 15.9248 0.5 20.6711 0.5 26.5353C0.5 32.3994 5.21065 37.1457 11.0122 37.1457H13.7377H14.1909L14.2353 37.5967C15.2299 47.7032 23.4399 55.6628 33.5858 56.1668L34.061 56.1904V56.6662V68.1108H51.939V56.6662Z"
        fill={fill}
        stroke="black"
      />
      <rect x="23.5" y="11.6108" width="19" height="22" rx="9.5" fill="white" stroke="black" />
      <rect x="28.5" y="14.6108" width="9" height="16" rx="4.5" fill="black" stroke="black" />
      <rect x="43.5" y="11.6108" width="19" height="22" rx="9.5" fill="white" stroke="black" />
      <path
        d="M46.6175 33.6108C46.6175 40.621 38.7563 40.621 38.7563 33.6108"
        stroke="black"
        strokeLinecap="round"
      />
      <rect x="48.5" y="14.6108" width="8" height="16" rx="4" fill="black" stroke="black" />
    </svg>
  );
};
