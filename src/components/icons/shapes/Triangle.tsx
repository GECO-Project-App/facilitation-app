import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Triangle: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 362,
  width = 362,
  fill = Colors.Pink,
  strokeWidth = 3,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 362 362"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M222.032 22.5778L268.143 83.3704C271.145 87.3273 274.673 90.8553 278.63 93.8566L339.422 139.968C366.592 160.576 366.592 201.424 339.422 222.032L278.63 268.143C274.673 271.145 271.145 274.673 268.143 278.63L222.032 339.422C201.424 366.592 160.576 366.592 139.968 339.422L93.8566 278.63C90.8553 274.673 87.3273 271.145 83.3704 268.143L22.5778 222.032C-4.59167 201.424 -4.59165 160.576 22.5778 139.968L83.3704 93.8566C87.3273 90.8553 90.8553 87.3273 93.8566 83.3704L139.968 22.5778C160.576 -4.59167 201.424 -4.59165 222.032 22.5778Z"
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
