import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const StarAlt3: FC<React.SVGProps<SVGSVGElement>> = ({
  width = 370,
  height = 362,
  fill = Colors.Pink,
  strokeWidth = 3,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 370 362"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M163.015 14.3748C172.872 -2.3999 197.128 -2.3999 206.985 14.3748L231.437 55.987C237.295 65.9554 248.595 71.3971 260.041 69.7616L307.82 62.9342C327.081 60.182 342.204 79.1462 335.235 97.3117L317.947 142.374C313.806 153.169 316.596 165.396 325.011 173.325L360.139 206.424C374.3 219.766 368.902 243.414 350.355 249.292L304.345 263.871C293.323 267.364 285.503 277.169 284.551 288.692L280.575 336.793C278.972 356.183 257.118 366.708 240.959 355.871L200.874 328.989C191.271 322.549 178.729 322.549 169.126 328.989L129.041 355.871C112.882 366.708 91.0277 356.183 89.425 336.793L85.4492 288.692C84.4968 277.169 76.6771 267.364 65.6552 263.871L19.6452 249.292C1.09765 243.414 -4.29985 219.766 9.86087 206.424L44.9886 173.325C53.4037 165.396 56.1945 153.169 52.053 142.374L34.765 97.3117C27.7958 79.1462 42.9193 60.182 62.1801 62.9342L109.959 69.7616C121.405 71.3971 132.705 65.9554 138.563 55.987L163.015 14.3748Z"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <foreignObject x="10%" y="10%" width="80%" height="80%">
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center',
            padding: 16,
          }}>
          <p
            style={{
              margin: 0,
              padding: 0,
              fontSize: '1em',
              fontWeight: 'bold',
              color: 'black',
              wordBreak: 'break-word',
            }}>
            {children}
          </p>
        </div>
      </foreignObject>
    </svg>
  );
};
