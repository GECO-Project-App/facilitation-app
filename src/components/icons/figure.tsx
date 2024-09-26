import React, {FC} from 'react';

export const Figure: FC<React.SVGProps<SVGSVGElement>> = ({height = 89, width = 82}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 82 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M49 52.9754V52.0235L49.9508 51.9766C59.3679 51.5129 66.9838 44.1907 67.9061 34.9012L67.9956 34H68.9012H71.5C76.7467 34 81 29.7467 81 24.5C81 19.2533 76.7467 15 71.5 15H68.0844H67.3503L67.1303 14.2996C64.709 6.59024 57.506 1 49 1H33C24.494 1 17.291 6.59024 14.8697 14.2997L14.6497 15H13.9156H10.5C5.2533 15 1 19.2533 1 24.5C1 29.7467 5.2533 34 10.5 34H13.0987H14.0044L14.0939 34.9012C15.0162 44.1907 22.6321 51.5129 32.0492 51.9766L33 52.0235V52.9754V88H49V52.9754Z"
        fill="#FE94C1"
        stroke="black"
        strokeWidth="2"
      />
      <path d="M37 39C37 50.5 58 50.5 58 39" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line
        x1="1"
        y1="-1"
        x2="4.83095"
        y2="-1"
        transform="matrix(-0.857493 -0.514496 -0.514496 0.857493 29 10)"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="-1"
        x2="4.83095"
        y2="-1"
        transform="matrix(-0.998177 0.0603586 0.0603586 0.998177 29 12)"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="-1"
        x2="4.83095"
        y2="-1"
        transform="matrix(-0.522784 -0.852465 -0.852465 0.522784 30 7.97069)"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="65.5227"
        y1="8.62803"
        x2="68.8077"
        y2="6.65702"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="66.2382"
        y1="11.0622"
        x2="70.0622"
        y2="11.2934"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="63.85"
        y1="6.59544"
        x2="65.8528"
        y2="3.32969"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="29"
        y="5"
        width="17"
        height="29"
        rx="8.5"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="33.75"
        y="9.64999"
        width="12.25"
        height="19.7"
        rx="6.125"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="48"
        y="5"
        width="17"
        height="29"
        rx="8.5"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x="52.75"
        y="9.64999"
        width="12.25"
        height="19.7"
        rx="6.125"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
