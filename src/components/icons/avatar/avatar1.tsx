import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar1: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 107,
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
      viewBox="0 0 74 107"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <rect
        x="-0.183013"
        y="0.683013"
        width="39"
        height="11"
        rx="5.5"
        transform="matrix(-0.866025 0.5 0.5 0.866025 37.9581 15.6913)"
        fill="#DB9EFD"
        stroke="black"
      />
      <rect
        x="36.1781"
        y="16.1996"
        width="39"
        height="11"
        rx="5.5"
        transform="rotate(30 36.1781 16.1996)"
        fill="#FE94C1"
        stroke="black"
      />
      <rect
        x="-0.683013"
        y="0.183013"
        width="39"
        height="11"
        rx="5.5"
        transform="matrix(-0.866025 -0.5 -0.5 0.866025 43.463 20.183)"
        fill="#68C9FF"
        stroke="black"
      />
      <rect
        x="30.683"
        y="20.6913"
        width="39"
        height="11"
        rx="5.5"
        transform="rotate(-30 30.683 20.6913)"
        fill="#FDDE39"
        stroke="black"
      />
      <path
        d="M44.4964 23.2347L44.4959 23.25L44.4964 23.2653C44.4988 23.3433 44.5 23.4215 44.5 23.5C44.5 26.6468 42.5619 29.342 39.8124 30.455L39.5 30.5815V30.9185V52V52.5H40H58C66.5604 52.5 73.5 59.4396 73.5 68V81.5C73.5 90.0604 66.5604 97 58 97H53H52.5V97.5V106H21.5V97.5V97H21H16C7.43959 97 0.5 90.0604 0.5 81.5V68C0.5 59.4396 7.43959 52.5 16 52.5H33H33.5V52V30.4297V30.1413L33.2504 29.9969C31.0073 28.6994 29.5 26.2754 29.5 23.5C29.5 23.4215 29.5012 23.3433 29.5036 23.2653L29.5041 23.25L29.5036 23.2347C29.5012 23.1567 29.5 23.0785 29.5 23C29.5 18.8579 32.8579 15.5 37 15.5C41.1421 15.5 44.5 18.8579 44.5 23C44.5 23.0785 44.4988 23.1567 44.4964 23.2347Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="17.5"
        y="43"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="22.5"
        y="48"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="37.5"
        y="43"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="42.5"
        y="48"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <path
        d="M40.8612 78.5C40.8612 85.5102 33 85.5102 33 78.5"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
