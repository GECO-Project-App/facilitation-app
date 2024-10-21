import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Head2: FC<React.SVGProps<SVGSVGElement>> = ({
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
        d="M51.939 56.0554V55.5796L52.4142 55.556C62.5601 55.0519 70.7701 47.0924 71.7647 36.9859L71.8091 36.5349H72.2623H74.9878C80.7894 36.5349 85.5 31.7886 85.5 25.9244C85.5 20.0602 80.7894 15.3139 74.9878 15.3139H71.4056H71.0376L70.9282 14.9626C68.3178 6.5772 60.5548 0.5 51.3902 0.5H34.6098C25.4452 0.5 17.6822 6.5772 15.0718 14.9626L14.9624 15.3139H14.5944H11.0122C5.21065 15.3139 0.5 20.0602 0.5 25.9244C0.5 31.7886 5.21065 36.5349 11.0122 36.5349H13.7377H14.1909L14.2353 36.9859C15.2299 47.0924 23.4399 55.0519 33.5858 55.556L34.061 55.5796V56.0554V98H51.939V56.0554Z"
        fill={fill}
        stroke="black"
      />
      {children}
    </svg>
  );
};
