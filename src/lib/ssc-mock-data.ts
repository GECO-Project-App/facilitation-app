const startData = [
  {
    id: 1,
    title: 'Formulate',
    step: 1,
    imageOne:'',
    Instructions: 'Start your journey to a healthier life',
    imageTwo:'',
    description: 'Start your journey to a healthier life',
    timer: 0,
},
{
    id: 2,
    title: 'Silent Brainstorm',
    step: 2,
    imageOne:'',
    Instructions: 'Start your journey to a healthier life',
    imageTwo:'',
    description: 'Start your journey to a healthier life',
    timer: 3,
  },
  {
    id: 3,
    title: 'Review & Discussion',
    step: 3,
    imageOne:'',
    Instructions: 'Start your journey to a healthier life',
    imageTwo:'',
    description: 'Start your journey to a healthier life',
    timer: 3,
  },
];

export const getSsdData = (type: string) => {
  if (type === 'start') {
    return startData;
  }
};