'use client';
import React, {useState, useEffect} from 'react';
import Survey from './Survey';
import {usePostHog} from 'posthog-js/react';
import { SSC_SURVEY_ID, CH_IN_SURVEY_ID, CH_OUT_SURVEY_ID } from '@/lib/surveys-id';
export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;
  const [showSurvey, setShowSurvey] = useState(true);

  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyID, setSurveyID] = useState('');

  const posthog = usePostHog();

  const getCurrentSurvey = (slug: string) => {
    switch (slug) {
      case 'ssc':
        return SSC_SURVEY_ID;
      case 'check-in':
        return CH_IN_SURVEY_ID;
      case 'check-out':
        return CH_OUT_SURVEY_ID;
      default:
        return '';
    }
  }

  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      console.log(surveys);
      if (surveys.length > 0) {
        const survey = surveys.find(survey => survey.id === getCurrentSurvey(slug));
        if (survey) {
          setSurveyID(survey.id);
          setSurveyTitle(survey.questions[0].question)
        }
      }
    });
  }, [posthog]);

  const handleSubmit = (value: string | null) => {
    console.log(value);
    setShowSurvey(false);
  };

  console.log(surveyID, surveyTitle);

  return (
    <main className="bg-yellow min-h-screen">
      {showSurvey && (
        <Survey
          title={slug === 'ssc' ? 'Start-Stop-Continue' : slug === 'check-in' ? 'Check-In' : slug === 'check-out' ? 'Check-Out' : ''}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
