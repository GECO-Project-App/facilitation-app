import React, {FC} from 'react';

export const Lamp: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 66,
  width = 43,
  fill = 'inherit',
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 43 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M30.0078 45.335L29.4305 45.6043V46.2413V54.2002H13.4488V46.2413V45.6043L12.8715 45.335C5.86391 42.0672 1 34.9147 1 26.614C1 15.2215 10.1588 6 21.4397 6C32.7206 6 41.8793 15.2215 41.8793 26.614C41.8793 34.9147 37.0154 42.0672 30.0078 45.335Z"
        fill={fill}
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M20.4984 53.1085V33.0284C20.4984 31.4112 19.1873 30.1001 17.5701 30.1001H17.4027C15.8779 30.1001 14.6417 31.3362 14.6417 32.8611V32.8611C14.6417 34.386 15.8764 35.6221 17.4013 35.6221C20.436 35.6221 24.0796 35.6221 26.525 35.6221C28.0498 35.6221 29.2834 34.386 29.2834 32.8611V32.8611C29.2834 31.3362 28.0473 30.1001 26.5224 30.1001H26.3551C24.7378 30.1001 23.4267 31.4112 23.4267 33.0284V53.1085"
        stroke="black"
        strokeWidth="2"
      />
      <mask id="path-3-inside-1_12_2305" fill="white">
        <path d="M11.5042 49.9252C11.5042 49.3729 11.9519 48.9252 12.5042 48.9252H30.3751C30.9274 48.9252 31.3751 49.3729 31.3751 49.9252V57.6586C31.3751 62.0768 27.7934 65.6586 23.3751 65.6586H19.5042C15.0859 65.6586 11.5042 62.0768 11.5042 57.6586V49.9252Z" />
      </mask>
      <path
        d="M11.5042 49.9252C11.5042 49.3729 11.9519 48.9252 12.5042 48.9252H30.3751C30.9274 48.9252 31.3751 49.3729 31.3751 49.9252V57.6586C31.3751 62.0768 27.7934 65.6586 23.3751 65.6586H19.5042C15.0859 65.6586 11.5042 62.0768 11.5042 57.6586V49.9252Z"
        fill="#FB8510"
        stroke="black"
        strokeWidth="4"
        mask="url(#path-3-inside-1_12_2305)"
      />
      <rect
        x="-1"
        y="1"
        width="10"
        height="18"
        rx="5"
        transform="matrix(-1 0 0 1 32 0)"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="-1"
        y="1"
        width="7"
        height="12"
        rx="3.5"
        transform="matrix(-1 0 0 1 29 3)"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="-1"
        y="1"
        width="10"
        height="18"
        rx="5"
        transform="matrix(-1 0 0 1 20 0)"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="-1"
        y="1"
        width="7"
        height="12"
        rx="3.5"
        transform="matrix(-1 0 0 1 17 3)"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
