import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar10: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 82,
  width = 86,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 86 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 56.6142V56.1384L52.4142 56.1148C62.5601 55.6108 70.7701 47.6512 71.7647 37.5447L71.8091 37.0937H72.2623H74.9878C80.7894 37.0937 85.5 32.3474 85.5 26.4832C85.5 20.6191 80.7894 15.8728 74.9878 15.8728H71.4056H71.0376L70.9282 15.5214C68.3178 7.13604 60.5548 1.05884 51.3902 1.05884H34.6098C29.602 1.05884 25.8758 1.11812 23.0923 1.41975C20.2987 1.72246 18.5414 2.26236 17.4056 3.15641C16.2948 4.03074 15.7045 5.30495 15.4014 7.28133C15.0958 9.27381 15.0944 11.8886 15.0944 15.3728V15.8728H14.5944H11.0122C5.21065 15.8728 0.5 20.6191 0.5 26.4832C0.5 32.3474 5.21065 37.0937 11.0122 37.0937H13.7377H14.2377V37.5937C14.2377 43.9116 16.538 48.3929 20.0721 51.3676C23.6214 54.3549 28.4612 55.8602 33.5858 56.1148L34.061 56.1384V56.6142V81H51.939V56.6142Z"
        fill={fill}
        stroke="black"
      />
      <rect x="13.5" y="15.5" width="29" height="8" rx="4" fill="white" stroke="black" />
      <rect x="27.5" y="16.5" width="14" height="6" rx="3" fill="black" stroke="black" />
      <rect x="43.5" y="15.5" width="29" height="8" rx="4" fill="white" stroke="black" />
      <path
        d="M46.6175 29C46.6175 36.0102 38.7563 36.0102 38.7563 29"
        stroke="black"
        strokeLinecap="round"
      />
      <rect x="60.5" y="16.5" width="12" height="6" rx="3" fill="black" stroke="black" />
    </svg>
  );
};
