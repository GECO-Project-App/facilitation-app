import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar25: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 100,
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
      viewBox="0 0 75 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M39.9811 29.8207L39.5806 29.902V30.3107V45.6108V46.1108H40.0806H58.0806C66.641 46.1108 73.5806 53.0504 73.5806 61.6108V74.6108C73.5806 83.1712 66.641 90.1108 58.0806 90.1108H53.0806H52.5806V90.6108V99.1108H21.5806V90.6108V90.1108H21.0806H16.0806C7.52015 90.1108 0.580566 83.1712 0.580566 74.6108V61.6108C0.580566 53.0504 7.52015 46.1108 16.0806 46.1108H33.0806H33.5806V45.6108V30.0715V29.6909L33.2136 29.5896C27.0824 27.8974 22.5806 22.2792 22.5806 15.6108C22.5806 7.60265 29.0724 1.11078 37.0806 1.11078C45.0887 1.11078 51.5806 7.60265 51.5806 15.6108C51.5806 22.6252 46.5994 28.4773 39.9811 29.8207Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="17.5806"
        y="36.1108"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="22.5806"
        y="41.1108"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="37.5806"
        y="36.1108"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="42.5806"
        y="41.1108"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <path
        d="M40.9417 71.6108C40.9417 78.621 33.0806 78.621 33.0806 71.6108"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
