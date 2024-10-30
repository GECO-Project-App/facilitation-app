import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Avatar24: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 90,
  width = 103,
  fill = Colors.Green,
  children,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 103 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M19.9446 21.0138L19.6384 21.2844L19.8428 21.6384L26.8994 33.8608L27.0437 34.1108H27.3324H74.7483H75.037L75.1813 33.8608L82.2379 21.6384L82.4423 21.2844L82.1361 21.0138C78.0569 17.4081 76.9382 11.3144 79.7656 6.41726C82.9936 0.82622 90.1428 -1.08941 95.7339 2.13858C101.325 5.36656 103.241 12.5158 100.013 18.1068C97.3247 22.7624 91.917 24.8704 86.9542 23.5804L86.5858 23.4846L86.3954 23.8143L80.8634 33.396L80.4737 34.0711L81.2498 34.1439C85.0589 34.5009 88.0403 37.708 88.0403 41.6108V70.6108C88.0403 74.7529 84.6825 78.1108 80.5403 78.1108H60.5403H60.0403V78.6108V89.1108H44.0403V78.6108V78.1108H43.5403H22.5403C18.3982 78.1108 15.0403 74.7529 15.0403 70.6108V41.6108C15.0403 38.0078 17.5814 34.9972 20.9695 34.2754L21.6422 34.1321L21.2983 33.5364L15.6852 23.8143L15.4949 23.4846L15.1264 23.5804C10.1637 24.8704 4.75602 22.7624 2.06814 18.1068C-1.15985 12.5158 0.755785 5.36656 6.34682 2.13858C11.9379 -1.08941 19.0871 0.82622 22.3151 6.41726C25.1424 11.3144 24.0238 17.4081 19.9446 21.0138Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="31.5"
        y="27.5704"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="36.5"
        y="32.5704"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <rect
        x="51.5"
        y="27.5704"
        width="18.915"
        height="35.2192"
        rx="9.45749"
        fill="white"
        stroke="black"
      />
      <rect
        x="56.5"
        y="32.5704"
        width="8.43341"
        height="24.4615"
        rx="4.21671"
        fill="black"
        stroke="black"
      />
      <path
        d="M54.8612 63.0704C54.8612 70.0806 47 70.0806 47 63.0704"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
