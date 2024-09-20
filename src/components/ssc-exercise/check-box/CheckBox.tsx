'use client';
import React from 'react';
import {Checked} from '@/components/icons/checked';

const CheckBox: React.FC<{chapter: string}> = ({chapter}) => {
    const value = localStorage.getItem('chapterDone') ;
    const doneChapters = value ? JSON.parse(value) : [];
  return (
    <figure className="mr-1 h-10 w-10 rounded-full border-2 border-black bg-white">
      <figcaption className="-mt-1 ml-1">{doneChapters.includes(chapter) ? <Checked /> : null}</figcaption>
      <figcaption className="-mt-1 ml-1"></figcaption>
    </figure>
  );
};

export default CheckBox;
