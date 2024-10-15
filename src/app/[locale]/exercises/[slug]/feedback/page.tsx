'use client';
import {PageLayout} from '@/components';
import DialogView from '@/components/modal/DialogView';
import {CH_IN_SURVEY_ID, CH_OUT_SURVEY_ID, SSC_SURVEY_ID, TEST_SURVEY_ID} from '@/lib/surveys-id';
import {useTranslations} from 'next-intl';
import {usePostHog} from 'posthog-js/react';
import {useEffect, useState} from 'react';
import Survey from './Survey';

export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;
  const t = useTranslations('feedback');

  const [showSurvey, setShowSurvey] = useState(true);

  // const [surveyTitle, setSurveyTitle] = useState('');
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
      case 'test':
        return TEST_SURVEY_ID;
      default:
        return '';
    }
  };

  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      if (surveys.length > 0) {
        const survey = surveys.find((survey) => survey.id === getCurrentSurvey(slug));
        if (survey) {
          setSurveyID(survey.id);
          // setSurveyTitle(survey.questions[0].question);
        }
      }
    });
  }, [posthog, slug]);

  const handleSubmit = (value: string | null) => {
    setShowSurvey(false);
    posthog.capture('survey sent', {
      $survey_id: surveyID, // required
      $survey_response: value, // required
    });
  };

  return (
    <PageLayout backgroundColor="bg-yellow" contentColor="bg-yellow">
      {showSurvey ? (
        <Survey
          title={
            slug === 'ssc'
              ? 'Start-Stop-Continue'
              : slug === 'check-in'
                ? 'Check-In'
                : slug === 'check-out'
                  ? 'Check-Out'
                  : ''
          }
          onSubmit={handleSubmit}
        />
      ) : (
        <DialogView destinationRoute="/" message={t('thankYouText')} icon="feedback" />
      )}
    </PageLayout>
  );
}
