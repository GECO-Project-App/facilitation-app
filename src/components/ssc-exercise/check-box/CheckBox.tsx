'use client';
import React, {useEffect, useState} from 'react';
import {Checked} from '@/components/icons/checked';

const CheckBox: React.FC<{chapter: string}> = ({chapter}) => {
  const [doneChapters, setDoneChapters] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('chapterDone') || '[]';
      setDoneChapters(JSON.parse(storedValue));
    }
  }, []);

  return (
    <figure className="h-10 w-10 rounded-full border-2 border-black bg-white">
      <figcaption className="-mt-1 ml-1">
        {doneChapters.includes(chapter) ? <Checked /> : null}
      </figcaption>
      <figcaption className="-mt-1 ml-1"></figcaption>
    </figure>
  );
};

export default CheckBox;
