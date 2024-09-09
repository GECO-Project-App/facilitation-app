import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const StarAlt4: FC<React.SVGProps<SVGSVGElement>> = ({
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
      viewBox="0 0 370 370"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M162.514 15.2194C172.123 -2.74462 197.877 -2.74463 207.486 15.2194L223.421 45.0129C229.831 56.9969 243.811 62.7877 256.818 58.8462L289.153 49.0473C308.65 43.139 326.861 61.35 320.953 80.8467L311.154 113.182C307.212 126.189 313.003 140.169 324.987 146.579L354.781 162.514C372.745 172.123 372.745 197.877 354.781 207.486L324.987 223.421C313.003 229.831 307.212 243.811 311.154 256.818L320.953 289.153C326.861 308.65 308.65 326.861 289.153 320.953L256.818 311.154C243.811 307.212 229.831 313.003 223.421 324.987L207.486 354.781C197.877 372.745 172.123 372.745 162.514 354.781L146.579 324.987C140.169 313.003 126.189 307.212 113.182 311.154L80.8467 320.953C61.35 326.861 43.139 308.65 49.0473 289.153L58.8462 256.818C62.7877 243.811 56.997 229.831 45.013 223.421L15.2194 207.486C-2.74462 197.877 -2.74463 172.123 15.2194 162.514L45.0129 146.579C56.9969 140.169 62.7877 126.189 58.8462 113.182L49.0473 80.8467C43.139 61.35 61.35 43.139 80.8467 49.0473L113.182 58.8462C126.189 62.7876 140.169 56.997 146.579 45.013L162.514 15.2194Z"
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
