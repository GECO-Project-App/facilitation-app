import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const Home: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 71,
  width = 63,
  fill = Colors.Orange,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 63 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.79997 48.8125V47.8125H8.79997H8.26687C5.4034 47.8125 3.14219 46.4835 1.94851 44.7052C0.766291 42.9439 0.604118 40.7227 1.94851 38.7198L25.1816 4.10733C26.5483 2.07135 28.9824 1 31.5 1C34.0176 0.999999 36.4517 2.07134 37.8184 4.10732L61.0515 38.7198C62.3959 40.7227 62.2337 42.9439 61.0515 44.7052C59.8578 46.4835 57.5966 47.8125 54.7331 47.8125H54.2H53.2V48.8125V63.9C53.2 67.1329 50.0988 70 45.9455 70H17.0545C12.9013 70 9.79997 67.1329 9.79997 63.9V48.8125Z"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
      <rect
        x="13"
        y="7"
        width="18"
        height="32"
        rx="9"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
      <rect
        x="13"
        y="11"
        width="14"
        height="21"
        rx="7"
        fill="black"
        stroke="black"
        stroke-width="2"
      />
      <rect
        x="33"
        y="7"
        width="18"
        height="32"
        rx="9"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
      <rect
        x="33"
        y="11"
        width="14"
        height="21"
        rx="7"
        fill="black"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  );
};
