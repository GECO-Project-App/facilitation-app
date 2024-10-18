import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const AvatarCharacter: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 48,
  width = 52,
  fill = Colors.Orange,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M31.0976 33.2421V32.7664L31.5728 32.7428C37.487 32.4489 42.2755 27.8085 42.8556 21.9136L42.9 21.4625H43.3532H44.9695C48.2959 21.4625 51 18.7407 51 15.3738C51 12.0069 48.2959 9.28502 44.9695 9.28502H42.8452H42.4772L42.3678 8.93363C40.8452 4.04256 36.3178 0.5 30.9756 0.5H21.0244C15.6822 0.5 11.1548 4.04256 9.63223 8.93363L9.52284 9.28502H9.15483H7.03049C3.70412 9.28502 1 12.0069 1 15.3738C1 18.7407 3.70412 21.4625 7.03049 21.4625H8.64678H9.09999L9.14438 21.9136C9.72448 27.8085 14.513 32.4489 20.4272 32.7428L20.9024 32.7664V33.2421V47.5H31.0976V33.2421Z"
        fill={fill}
        stroke="black"
      />
      <rect
        x="14.6597"
        y="3.14733"
        width="10.81"
        height="20.4788"
        rx="5.40502"
        fill="white"
        stroke="black"
      />
      <rect
        x="17.7676"
        y="6.44824"
        width="4.59423"
        height="14.0992"
        rx="2.29712"
        fill="black"
        stroke="black"
      />
      <rect
        x="26.4697"
        y="3.14733"
        width="10.81"
        height="20.4788"
        rx="5.40502"
        fill="white"
        stroke="black"
      />
      <path
        d="M28.1453 25.3009C28.1453 29.4581 23.4834 29.4581 23.4834 25.3009"
        stroke="black"
        strokeLinecap="round"
      />
      <rect
        x="29.4858"
        y="6.55486"
        width="4.59423"
        height="14.0992"
        rx="2.29712"
        fill="black"
        stroke="black"
      />
    </svg>
  );
};
