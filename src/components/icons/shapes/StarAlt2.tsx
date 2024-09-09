import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const StarAlt2: FC<React.SVGProps<SVGSVGElement>> = ({
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
      viewBox="0 0 342 386"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M149.586 13.8821C159.633 -1.65731 182.367 -1.65729 192.414 13.8821L227.809 68.6252C232.784 76.3202 241.156 81.1535 250.307 81.6148L315.414 84.8961C333.895 85.8276 345.261 105.515 336.828 121.986L307.116 180.01C302.94 188.167 302.94 197.833 307.116 205.99L336.828 264.014C345.261 280.485 333.895 300.172 315.414 301.104L250.307 304.385C241.156 304.846 232.784 309.68 227.809 317.375L192.414 372.118C182.367 387.657 159.633 387.657 149.586 372.118L114.191 317.375C109.216 309.68 100.844 304.846 91.6926 304.385L26.5864 301.104C8.10521 300.172 -3.26147 280.485 5.17245 264.014L34.8839 205.99C39.0603 197.833 39.0603 188.167 34.8839 180.01L5.17247 121.986C-3.26146 105.515 8.10518 85.8276 26.5863 84.8961L91.6926 81.6148C100.844 81.1535 109.216 76.3201 114.191 68.6252L149.586 13.8821Z"
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
