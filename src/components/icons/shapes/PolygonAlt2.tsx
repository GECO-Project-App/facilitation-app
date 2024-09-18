import {Colors} from '@/lib/constants';
import React, {FC} from 'react';

export const PolygonAlt2: FC<React.SVGProps<SVGSVGElement>> = ({
  height = 349,
  width = 348,
  fill = Colors.Green,
  strokeWidth = 2,
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 348 349"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M154.415 10.5161C164.925 -1.01822 183.075 -1.01821 193.585 10.5161L199.761 17.2956C207.466 25.7526 219.391 28.9478 230.293 25.4764L239.032 22.6936C253.899 17.9589 269.618 27.0345 272.952 42.2779L274.912 51.2377C277.356 62.4141 286.087 71.1436 297.263 73.5879L306.222 75.5475C321.466 78.8812 330.541 94.6006 325.807 109.469L323.023 118.208C319.553 129.109 322.747 141.034 331.205 148.739L337.984 154.915C349.519 165.425 349.519 183.575 337.984 194.085L331.205 200.262C322.747 207.966 319.553 219.891 323.023 230.793L325.807 239.532C330.541 254.399 321.466 270.118 306.222 273.452L297.263 275.412C286.087 277.856 277.356 286.586 274.912 297.763L272.952 306.722C269.618 321.966 253.899 331.041 239.032 326.307L230.293 323.523C219.391 320.053 207.466 323.247 199.761 331.704L193.585 338.484C183.075 350.019 164.925 350.019 154.415 338.484L148.24 331.704C140.534 323.247 128.609 320.053 117.708 323.523L108.969 326.307C94.1007 331.041 78.3814 321.966 75.0476 306.722L73.088 297.763C70.6437 286.586 61.9142 277.856 50.7378 275.412L41.7781 273.452C26.5347 270.118 17.4591 254.399 22.1937 239.532L24.9765 230.793C28.4479 219.891 25.2528 207.966 16.7957 200.261L10.0162 194.085C-1.5181 183.575 -1.51809 165.425 10.0162 154.915L16.7957 148.739C25.2528 141.034 28.4479 129.109 24.9765 118.208L22.1937 109.469C17.4591 94.6006 26.5347 78.8812 41.7781 75.5475L50.7378 73.5879C61.9142 71.1436 70.6437 62.4141 73.088 51.2377L75.0476 42.2779C78.3814 27.0345 94.1007 17.9589 108.969 22.6936L117.708 25.4764C128.609 28.9478 140.534 25.7525 148.24 17.2956L154.415 10.5161Z"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <foreignObject x="0%" y="0%" width={width} height={height}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center',
            padding: 20,
          }}>
          <h4
            style={{
              margin: 0,
              padding: 0,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: fill == Colors.Blue || Colors.Green ? 'white' : 'black',
              wordBreak: 'break-word',
            }}>
            {children}
          </h4>
        </div>
      </foreignObject>
    </svg>
  );
};
