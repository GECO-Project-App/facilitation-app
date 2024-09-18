import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Rounded: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 350,
  width = 350,
  fill = Colors.Yellow,
  strokeWidth = 2,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 350 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M163.812 4.40708C170.858 0.897343 179.142 0.897349 186.188 4.40709L285.068 53.6593C289.951 56.0918 293.909 60.0494 296.34 64.9328L345.593 163.812C349.103 170.858 349.103 179.142 345.593 186.188L296.34 285.068C293.909 289.951 289.951 293.909 285.068 296.34L186.188 345.593C179.142 349.103 170.858 349.103 163.812 345.593L64.9328 296.34C60.0494 293.909 56.0918 289.951 53.6593 285.068L4.40708 186.188C0.897343 179.142 0.897349 170.858 4.40709 163.812L53.6593 64.9328C56.0918 60.0494 60.0494 56.0918 64.9328 53.6593L163.812 4.40708Z"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <foreignObject x="0%" y="0%" width={width} height={height}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center',
            padding: 20,
          }}>
          <h4
            style={{
              margin: 0,
              padding: 0,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: 'black',
              wordBreak: 'break-word',
            }}>
            {children}
          </h4>
        </div>
      </foreignObject>
    </svg>
  );
};
