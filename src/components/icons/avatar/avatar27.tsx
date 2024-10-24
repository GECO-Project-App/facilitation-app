import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar27: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 84,
  width = 74,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 74 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M62.5 39.4075V39.7695L62.8439 39.8825C69.0327 41.9167 73.5 47.7427 73.5 54.6108V57.6108C73.5 66.1712 66.5604 73.1108 58 73.1108H53H52.5V73.6108V83.1108H21.5V73.6108V73.1108H21H16C7.43959 73.1108 0.5 66.1712 0.5 57.6108V54.6108C0.5 47.7427 4.96735 41.9167 11.1561 39.8825L11.5 39.7695V39.4075L11.5 10.6108C11.5 5.36407 15.7533 1.11078 21 1.11078C26.2467 1.11078 30.5 5.36407 30.5 10.6108V38.6108V39.1108H31H43H43.5V38.6108V10.6108C43.5 5.36407 47.7533 1.11078 53 1.11078C58.2467 1.11078 62.5 5.36407 62.5 10.6108V39.4075Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="17.5"
        y="29.1108"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="22.5"
        y="34.1108"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="37.5"
        y="29.1108"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="42.5"
        y="34.1108"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <path
        d="M40.8612 64.6108C40.8612 71.621 33 71.621 33 64.6108"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
