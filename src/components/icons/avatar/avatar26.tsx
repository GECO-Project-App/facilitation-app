import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar26: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 64,
  width = 75,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 75 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <rect x="0.580566" y="11.1108" width="73" height="44" fill={fill} stroke="black" />
      <rect x="57.5806" y="57.1108" width="16" height="6" fill={fill} stroke="black" />
      <rect x="28.5806" y="57.1108" width="16" height="6" fill={fill} stroke="black" />
      <rect x="0.580566" y="57.1108" width="16" height="6" fill={fill} stroke="black" />
      <rect
        x="17.5806"
        y="1.11078"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="22.5806"
        y="6.11078"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="37.5806"
        y="1.11078"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="42.5806"
        y="6.11078"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
