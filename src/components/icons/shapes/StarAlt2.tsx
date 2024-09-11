import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const StarAlt2: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 350,
  width = 350,
  fill = Colors.Purple,
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
        d="M158.216 7.92071C167.888 -0.320984 182.112 -0.320982 191.784 7.92072L223.482 34.9352C228.064 38.8387 233.759 41.1977 239.758 41.6764L281.275 44.9896C293.941 46.0003 304 56.0584 305.011 68.7247L308.324 110.242C308.802 116.241 311.161 121.936 315.065 126.517L342.079 158.216C350.321 167.888 350.321 182.112 342.079 191.784L315.065 223.482C311.161 228.064 308.802 233.759 308.324 239.758L305.011 281.275C304 293.941 293.941 304 281.275 305.011L239.758 308.324C233.759 308.802 228.064 311.161 223.482 315.065L191.784 342.079C182.112 350.321 167.888 350.321 158.216 342.079L126.517 315.065C121.936 311.161 116.241 308.802 110.242 308.324L68.7246 305.011C56.0584 304 46.0003 293.941 44.9895 281.275L41.6764 239.758C41.1977 233.759 38.8386 228.064 34.9351 223.482L7.92064 191.784C-0.321045 182.112 -0.321043 167.888 7.92066 158.216L34.9351 126.517C38.8386 121.936 41.1977 116.241 41.6764 110.242L44.9895 68.7246C46.0003 56.0584 56.0584 46.0003 68.7247 44.9896L110.242 41.6764C116.241 41.1977 121.936 38.8387 126.517 34.9352L158.216 7.92071Z"
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
          <p
            style={{
              margin: 0,
              padding: 0,
              fontSize: '0.9rem',
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
