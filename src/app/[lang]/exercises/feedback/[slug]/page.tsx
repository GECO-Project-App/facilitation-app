'use client';
import React from 'react';
import Survey from './Survey';

export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;

  const handleSubmit = (value: string | null) => {
    console.log(value);
  };

  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-yellow">
      <Survey
        title={slug === 'ssc' ? 'Start-Stop-Continue Exercise' : ''}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
