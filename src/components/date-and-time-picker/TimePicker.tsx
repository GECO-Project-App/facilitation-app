'use client';

import React from 'react';

export function TimePicker({
  hours,
  setHours,
  minutes,
  setMinutes,
}: {
  hours: string;
  setHours: (hours: string) => void;
  minutes: string;
  setMinutes: (minutes: string) => void;
}) {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHours(e.target.value);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(e.target.value);
  };

  return (
    <section className="space-y-4">
      <div className="w-full h-[1px] bg-gray-200">
        <p className="text-sm font-medium py-2">Time</p>
      </div>
      <div className="flex space-x-2 pt-4">
        <input
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={handleHoursChange}
          placeholder="HH"
          className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinutesChange}
          placeholder="MM"
          className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
