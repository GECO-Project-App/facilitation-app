import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Head1: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 92,
  width = 74,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 74 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M44.4964 8.23466L44.4959 8.25L44.4964 8.26534C44.4988 8.34326 44.5 8.42148 44.5 8.5C44.5 11.6468 42.5619 14.342 39.8124 15.455L39.5 15.5815V15.9185V37V37.5H40H58C66.5604 37.5 73.5 44.4396 73.5 53V66.5C73.5 75.0604 66.5604 82 58 82H53H52.5V82.5V91H21.5V82.5V82H21H16C7.43959 82 0.5 75.0604 0.5 66.5V53C0.5 44.4396 7.43959 37.5 16 37.5H33H33.5V37V15.4297V15.1413L33.2504 14.9969C31.0073 13.6994 29.5 11.2754 29.5 8.5C29.5 8.42148 29.5012 8.34325 29.5036 8.26534L29.5041 8.25L29.5036 8.23466C29.5012 8.15675 29.5 8.07852 29.5 8C29.5 3.85786 32.8579 0.5 37 0.5C41.1421 0.5 44.5 3.85786 44.5 8C44.5 8.07852 44.4988 8.15674 44.4964 8.23466Z"
        fill={fill}
        stroke="black"
      />
      {children}
    </svg>
  );
};
