import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Star: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 280,
  width = 280,
  fill = Colors.Pink,
  strokeWidth = 3,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 376 360"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M208.813 12.9972L258.582 83.3026C262.198 88.4108 267.395 92.1867 273.371 94.0473L355.614 119.655C372.408 124.883 378.99 145.142 368.478 159.243L316.993 228.302C313.252 233.32 311.267 239.429 311.344 245.687L312.404 331.819C312.621 349.406 295.388 361.927 278.728 356.286L197.14 328.661C191.212 326.654 184.788 326.654 178.86 328.661L97.2717 356.286C80.6123 361.927 63.3791 349.406 63.5957 331.819L64.6563 245.687C64.7333 239.429 62.7482 233.32 59.0074 228.302L7.52249 159.243C-2.99011 145.142 3.5924 124.883 20.3856 119.655L102.629 94.0473C108.605 92.1867 113.802 88.4108 117.418 83.3026L167.187 12.9972C177.349 -1.35825 198.651 -1.35825 208.813 12.9972Z"
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
              fontSize: '1.4rem',
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
