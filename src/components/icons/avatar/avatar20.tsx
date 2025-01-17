import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar20: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 84,
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
      viewBox="0 0 86 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M51.939 80.1108V79.635L52.4142 79.6114C62.5601 79.1074 70.7701 71.1478 71.7647 61.0413L71.8091 60.5903H72.2623H74.9878C80.7894 60.5903 85.5 55.844 85.5 49.9798C85.5 44.1156 80.7894 39.3694 74.9878 39.3694H71.4056H71.0376L70.9282 39.018C68.3178 30.6326 60.5548 24.5554 51.3902 24.5554H34.6098C25.4452 24.5554 17.6822 30.6326 15.0718 39.018L14.9624 39.3694H14.5944H11.0122C5.21065 39.3694 0.5 44.1156 0.5 49.9798C0.5 55.844 5.21065 60.5903 11.0122 60.5903H13.7377H14.1909L14.2353 61.0413C15.2299 71.1478 23.4399 79.1074 33.5858 79.6114L34.061 79.635V80.1108V83.1108H51.939V80.1108Z"
        fill={fill}
        stroke="black"
      />
      <path
        d="M23.5342 10.4575C23.5342 5.23426 27.7684 1 32.9917 1C38.2149 1 42.4492 5.23426 42.4492 10.4575V36.2192H23.5342V10.4575Z"
        fill="white"
        stroke="black"
      />
      <path
        d="M28.7749 10.7829C28.7749 8.45404 30.6628 6.56616 32.9916 6.56616C35.3204 6.56616 37.2083 8.45405 37.2083 10.7829V31.0276H28.7749V10.7829Z"
        fill="black"
        stroke="black"
      />
      <path
        d="M43.4487 10.4575C43.4487 5.23426 47.683 1 52.9062 1C58.1294 1 62.3637 5.23426 62.3637 10.4575V36.2192H43.4487V10.4575Z"
        fill="white"
        stroke="black"
      />
      <path
        d="M46.6175 37.7002C46.6175 44.7104 38.7563 44.7104 38.7563 37.7002"
        stroke="black"
        strokeLinecap="round"
      />
      <path
        d="M48.5352 10.9628C48.5352 8.63398 50.423 6.74609 52.7519 6.74609C55.0807 6.74609 56.9686 8.63398 56.9686 10.9628V31.2076H48.5352V10.9628Z"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
