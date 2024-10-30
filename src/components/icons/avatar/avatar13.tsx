import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar13: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 76,
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
      viewBox="0 0 86 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 63.6662V63.1904L52.4142 63.1668C62.5601 62.6628 70.7701 54.7032 71.7647 44.5967L71.8091 44.1457H72.2623H74.9878C80.7894 44.1457 85.5 39.3994 85.5 33.5353C85.5 27.6711 80.7894 22.9248 74.9878 22.9248H71.4056H71.0376L70.9282 22.5734C68.3178 14.188 60.5548 8.11084 51.3902 8.11084H34.6098C25.4452 8.11084 17.6822 14.188 15.0718 22.5734L14.9624 22.9248H14.5944H11.0122C5.21065 22.9248 0.5 27.6711 0.5 33.5353C0.5 39.3994 5.21065 44.1457 11.0122 44.1457H13.7377H14.1909L14.2353 44.5967C15.2299 54.7032 23.4399 62.6628 33.5858 63.1668L34.061 63.1904V63.6662V75.1108H51.939V63.6662Z"
        fill={fill}
        stroke="black"
      />
      <rect x="16.5" y="0.61084" width="26" height="34" rx="13" fill="white" stroke="black" />
      <rect x="21.5" y="5.61084" width="16" height="24" rx="8" fill="black" stroke="black" />
      <rect x="43.5" y="0.61084" width="25" height="34" rx="12.5" fill="white" stroke="black" />
      <path
        d="M46.6175 37.2751C46.6175 44.2853 38.7563 44.2853 38.7563 37.2751"
        stroke="black"
        strokeLinecap="round"
      />
      <rect x="47.5" y="5.61084" width="16" height="24" rx="8" fill="black" stroke="black" />
    </svg>
  );
};
