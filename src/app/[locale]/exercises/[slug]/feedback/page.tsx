'use client';
import {PageLayout} from '@/components';
import {Confetti} from '@/components/icons/confetti';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {
  CH_IN_SURVEY_ID,
  CH_OUT_SURVEY_ID,
  SSC_SURVEY_ID,
  TEST_SURVEY_ID,
  TUTORIAL_TO_ME_SURVEY_ID,
} from '@/lib/surveys-id';
import {useTranslations} from 'next-intl';
import {usePostHog} from 'posthog-js/react';
import {useEffect, useState} from 'react';
import Survey from './Survey';

export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;
  const t = useTranslations('feedback');
  const {toast} = useToast();
  const router = useRouter();

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
      case 'ttm':
        return TUTORIAL_TO_ME_SURVEY_ID;
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
    posthog.capture('survey sent', {
      $survey_id: surveyID, // required
      $survey_response: value, // required
    });

    router.push('/');
    toast({
      variant: 'transparent',
      size: 'fullscreen',
      duration: 2000,
      className: 'text-black bg-pink',
      children: (
        <>
          <Confetti />
          <h3 className="text-2xl font-bold">{t('thankYouText')}</h3>
        </>
      ),
    });
  };

  return (
    <PageLayout backgroundColor="bg-yellow" contentColor="bg-yellow">
      <Survey
        title={
          slug === 'ssc'
            ? 'Start-Stop-Continue'
            : slug === 'check-in'
              ? 'Check-In'
              : slug === 'check-out'
                ? 'Check-Out'
                : slug === 'ttm'
                  ? 'Tutorial to Me'
                  : ''
        }
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
}
