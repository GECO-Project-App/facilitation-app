'use client';
import React, {useState, useEffect} from 'react';
import Survey from './Survey';
import {usePostHog} from 'posthog-js/react';

export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;
  const [showSurvey, setShowSurvey] = useState(true);

  const posthog = usePostHog();

  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      console.log(surveys);
    });
  }, [posthog]);

  const handleSubmit = (value: string | null) => {
    console.log(value);
  };

  return (
    <main className="bg-yellow min-h-screen">
      {showSurvey && (
        <Survey
          title={slug === 'ssc' ? 'Start-Stop-Continue' : ''}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
