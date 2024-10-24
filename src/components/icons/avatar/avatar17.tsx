import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar17: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 66,
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
      viewBox="0 0 86 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 59.6662V59.1904L52.4142 59.1668C62.5601 58.6628 70.7701 50.7032 71.7647 40.5967L71.8091 40.1457H72.2623H74.9878C80.7894 40.1457 85.5 35.3994 85.5 29.5353C85.5 23.6711 80.7894 18.9248 74.9878 18.9248H71.4056H71.0376L70.9282 18.5734C68.3178 10.188 60.5548 4.11084 51.3902 4.11084H34.6098C25.4452 4.11084 17.6822 10.188 15.0718 18.5734L14.9624 18.9248H14.5944H11.0122C5.21065 18.9248 0.5 23.6711 0.5 29.5353C0.5 35.3994 5.21065 40.1457 11.0122 40.1457H13.7377H14.1909L14.2353 40.5967C15.2299 50.7032 23.4399 58.6628 33.5858 59.1668L34.061 59.1904V59.6662V65.1108H51.939V59.6662Z"
        fill={fill}
        stroke="black"
      />
      <rect x="23.5342" y="1.11084" width="18.915" height="35.2192" fill="white" stroke="black" />
      <rect
        x="28.7749"
        y="6.677"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect x="43.4487" y="1.11084" width="18.915" height="35.2192" fill="white" stroke="black" />
      <path
        d="M46.6175 38.811C46.6175 45.8212 38.7563 45.8212 38.7563 38.811"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="48.5352"
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
