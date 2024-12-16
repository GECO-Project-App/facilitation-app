import {useEffect, useState} from 'react';

export function useTutorialLocalStorage(currentStep: number) {
  const [one, setOne] = useState(localStorage.getItem('strengths') ?? '');
  // const [two, setTwo] = useState(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
  // const [three, setThree] = useState(
  //   JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '',
  // );

  useEffect(() => {
    if (currentStep === 0) {
      setOne(localStorage.getItem('strengths') ?? '');
      // setTwo(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
      // setThree(JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '');
    }
    if (currentStep === 1) {
      setOne(localStorage.getItem('weaknesses') ?? '');
      // setTwo(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[1] ?? '');
      // setThree(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[2] ?? '');
    }
    if (currentStep === 2) {
      setOne(localStorage.getItem('communications') ?? '');
      // setTwo(JSON.parse(localStorage.getItem('communications') ?? '[]')[1] ?? '');
      // setThree(JSON.parse(localStorage.getItem('communications') ?? '[]')[2] ?? '');
    }
  }, [currentStep]);

  const setStrengths = () => {
    const strengths = one;
    localStorage.setItem('strengths', strengths);
  };

  const setWeaknesses = () => {
    const weaknesses = one;
    localStorage.setItem('weaknesses', weaknesses);
  };

  const setCommunications = () => {
    const communications = one;
    localStorage.setItem('communications', communications);
  };

  const clearTutorialLocalStorage = () => {
    localStorage.removeItem('strengths');
    localStorage.removeItem('weaknesses');
    localStorage.removeItem('communications');
  };

  return {
    one,
    // two,
    // three,
    setOne,
    // setTwo,
    // setThree,
    setStrengths,
    setWeaknesses,
    setCommunications,
    clearTutorialLocalStorage,
  };
}
