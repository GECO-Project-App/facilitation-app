import {useEffect, useState} from 'react';

export function useTutorialLocalStorage(currentStep: number) {
  const [one, setOne] = useState(JSON.parse(localStorage.getItem('strengths') ?? '[]')[0] ?? '');
  const [two, setTwo] = useState(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
  const [three, setThree] = useState(
    JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '',
  );

  useEffect(() => {
    if (currentStep === 0) {
      setOne(JSON.parse(localStorage.getItem('strengths') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('strengths') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('strengths') ?? '[]')[2] ?? '');
    }
    if (currentStep === 1) {
      setOne(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('weaknesses') ?? '[]')[2] ?? '');
    }
    if (currentStep === 2) {
      setOne(JSON.parse(localStorage.getItem('communications') ?? '[]')[0] ?? '');
      setTwo(JSON.parse(localStorage.getItem('communications') ?? '[]')[1] ?? '');
      setThree(JSON.parse(localStorage.getItem('communications') ?? '[]')[2] ?? '');
    }
  }, [currentStep]);

  const setStrengths = () => {
    const strengths = [one, two, three];
    localStorage.setItem('strengths', JSON.stringify(strengths));
  };

  const setWeaknesses = () => {
    const weaknesses = [one, two, three];
    localStorage.setItem('weaknesses', JSON.stringify(weaknesses));
  };

  const setCommunications = () => {
    const communications = [one, two, three];
    localStorage.setItem('communications', JSON.stringify(communications));
  };

  const clearTutorialLocalStorage = () => {
    localStorage.removeItem('strengths');
    localStorage.removeItem('weaknesses');
    localStorage.removeItem('communications');
  };

  return {
    one,
    two,
    three,
    setOne,
    setTwo,
    setThree,
    setStrengths,
    setWeaknesses,
    setCommunications,
    clearTutorialLocalStorage,
  };
}
