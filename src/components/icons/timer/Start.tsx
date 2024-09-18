import React, {FC} from 'react';

export const Start: FC<React.SVGProps<SVGSVGElement>> = ({height = 50, width = 50}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="18 24 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29 58.0699V40.9323C29 36.1973 34.2278 33.3281 38.2221 35.8708L50.6469 43.7805C54.1944 46.0389 54.3783 51.1514 51.0023 53.6588L38.5775 62.8868C34.6186 65.827 29 63.0013 29 58.0699Z"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M29 56.0699V38.9323C29 34.1973 34.2278 31.3281 38.2221 33.8708L50.6469 41.7805C54.1944 44.0389 54.3783 49.1514 51.0023 51.6588L38.5775 60.8868C34.6186 63.827 29 61.0013 29 56.0699Z"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M29 56.0699V38.9323C29 34.1973 34.2278 31.3281 38.2221 33.8708L50.6469 41.7805C54.1944 44.0389 54.3783 49.1514 51.0023 51.6588L38.5775 60.8868C34.6186 63.827 29 61.0013 29 56.0699Z"
        fill="#0CAC56"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
