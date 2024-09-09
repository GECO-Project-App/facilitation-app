import dynamic from 'next/dynamic';

const Triangle = dynamic(() => import('@/components/icons').then((mod) => mod.Triangle), {
  ssr: false,
});
const Star = dynamic(() => import('@/components/icons').then((mod) => mod.Star), {
  ssr: false,
});

const StarAlt3 = dynamic(() => import('@/components/icons').then((mod) => mod.StarAlt3), {
  ssr: false,
});

const StarAlt4 = dynamic(() => import('@/components/icons').then((mod) => mod.StarAlt4), {
  ssr: false,
});

export const Colors = {
  White: '#FFFF',
  Black: '#000000',
  Purple: '#DB9EFD',
  Pink: '#FE94C1',
  Green: '#0CAC56',
  Orange: '#FB8510',
  Yellow: '#FCD548',
  Blue: '#5553FE',
};

export const ShapeColors = {
  Purple: '#DB9EFD',
  Pink: '#FE94C1',
  Green: '#0CAC56',
  Orange: '#FB8510',
  Yellow: '#FCD548',
};

export const QuestionShapes = [Star, StarAlt3, StarAlt4];
