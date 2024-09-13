import React, {FC} from 'react';

export const Checked: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 36,
  width = 35,
  fill = 'white',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 35 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 19L10.5368 32.5663C10.9004 33.2208 11.8278 33.2583 12.243 32.6354L32 3"
        stroke="black"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  );
};
