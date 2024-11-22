'use client';

import {useTutorialToMe} from '@/store/useTutorialToMe';
import React from 'react';

export function TimePicker({mode}: {mode: 'writing' | 'reviewing'}) {
  const {setWritingTime, writingTime, setReviewingTime, reviewingTime} = useTutorialToMe();
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === 'writing') {
      setWritingTime(e.target.value);
    } else if (mode === 'reviewing') {
      setReviewingTime(e.target.value);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex space-x-2 pt-4 justify-center">
        <input
          type="time"
          min="0"
          max="23"
          value={mode === 'writing' ? writingTime || '' : reviewingTime || ''}
          onChange={handleHoursChange}
          placeholder="HH"
          className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
