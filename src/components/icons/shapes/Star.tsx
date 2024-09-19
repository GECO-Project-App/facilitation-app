import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Star: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 349,
  width = 308,
  fill = Colors.Pink,
  strokeWidth = 2,
  color = fill === Colors.Blue ? Colors.White : Colors.Black,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 308 349"
      fill="none"
      color={color}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M138.42 6.93669C147.608 -0.125628 160.392 -0.125624 169.58 6.93669L222.792 47.8362C224.757 49.3469 226.913 50.5925 229.203 51.5407L291.198 77.2139C301.903 81.647 308.295 92.7274 306.778 104.223L297.994 170.796C297.67 173.255 297.67 175.745 297.994 178.204L306.778 244.777C308.295 256.272 301.903 267.353 291.198 271.786L229.203 297.46C226.913 298.407 224.757 299.654 222.792 301.164L169.58 342.063C160.392 349.125 147.608 349.125 138.42 342.063L85.208 301.164C83.2425 299.654 81.087 298.407 78.797 297.46L16.802 271.786C6.09691 267.353 -0.294871 256.272 1.22179 244.777L10.0051 178.204C10.3296 175.745 10.3296 173.255 10.0051 170.796L1.22179 104.223C-0.294869 92.7274 6.0969 81.647 16.802 77.2139L78.797 51.5407C81.087 50.5925 83.2425 49.3469 85.208 47.8362L138.42 6.93669Z"
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
