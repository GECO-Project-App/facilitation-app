import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Polygon: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 365,
  width = 350,
  fill = Colors.Orange,
  strokeWidth = 2,
  color = fill === Colors.Blue ? Colors.White : Colors.Black,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 350 365"
      fill="none"
      color={color}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M194.028 8.91437L211.769 26.0775C218.475 32.5643 227.798 35.5937 237.036 34.2872L261.477 30.83C276.092 28.7628 289.713 38.6593 292.264 53.1983L296.529 77.5118C298.141 86.7011 303.904 94.6322 312.145 99.0048L333.95 110.574C346.99 117.493 352.192 133.506 345.711 146.768L334.869 168.944C330.773 177.326 330.773 187.129 334.869 195.511L345.711 217.688C352.192 230.949 346.99 246.961 333.95 253.881L312.145 265.449C303.904 269.822 298.141 277.754 296.529 286.943L292.264 311.256C289.713 325.795 276.092 335.691 261.477 333.624L237.036 330.168C227.798 328.861 218.475 331.89 211.769 338.378L194.028 355.541C183.419 365.803 166.581 365.803 155.972 355.541L138.231 338.378C131.525 331.89 122.202 328.861 112.964 330.168L88.5228 333.624C73.9072 335.691 60.2857 325.795 57.7355 311.256L53.4705 286.943C51.8587 277.754 46.0963 269.822 37.8549 265.449L16.0493 253.881C3.01002 246.961 -2.1929 230.949 4.28967 217.688L15.1304 195.511C19.2276 187.129 19.2276 177.326 15.1304 168.944L4.28967 146.768C-2.1929 133.506 3.01002 117.493 16.0493 110.574L37.8549 99.0048C46.0963 94.6322 51.8587 86.7011 53.4705 77.5118L57.7355 53.1983C60.2857 38.6593 73.9072 28.7628 88.5228 30.83L112.964 34.2872C122.202 35.5937 131.525 32.5643 138.231 26.0775L155.972 8.91439C166.581 -1.3489 183.419 -1.34891 194.028 8.91437Z"
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
              color: 'currentcolor',
              wordBreak: 'break-word',
            }}>
            {children}
          </h4>
        </div>
      </foreignObject>
    </svg>
  );
};
