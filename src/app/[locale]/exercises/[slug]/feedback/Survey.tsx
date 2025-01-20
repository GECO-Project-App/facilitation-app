'use client';
import {Button, Header, PageLayout} from '@/components';
import {Confetti} from '@/components/icons/confetti';
import {TextareaWithHeader} from '@/components/ui/textarea';
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
import {useParams} from 'next/navigation';
import {usePostHog} from 'posthog-js/react';
import {FC, useEffect, useState} from 'react';

export const Survey: FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const posthog = usePostHog();
  const {slug} = useParams();
  const {toast} = useToast();
  const [surveyID, setSurveyID] = useState('');

  const getCurrentSurvey = (slug: string) => {
    switch (slug) {
      case 'ssc':
        return SSC_SURVEY_ID;
      case 'check-in':
        return CH_IN_SURVEY_ID;
      case 'check-out':
        return CH_OUT_SURVEY_ID;
      case 'ttm':
        return TUTORIAL_TO_ME_SURVEY_ID;
      default:
        return TEST_SURVEY_ID;
    }
  };
  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      if (surveys.length > 0) {
        const survey = surveys.find((survey) => survey.id === getCurrentSurvey(slug as string));
        if (survey) {
          setSurveyID(survey.id);
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
          <h3 className="text-2xl font-bold">{t('feedback.thankYouText')}</h3>
        </>
      ),
    });
  };

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      contentColor="bg-yellow"
      header={
        <Header>
          <div className="border-2 border-black rounded-full px-4 py-2 bg-pink">
            <h3 className="text-xl font-bold">Feedback</h3>
          </div>
        </Header>
      }
      footer={
        <Button variant="pink" onClick={() => handleSubmit(null)}>
          {t('feedback.button')}
        </Button>
      }>
      <TextareaWithHeader
        title={t(`common.slugs.${slug}`)}
        subtitle={t('feedback.title')}
        placeholder={t('feedback.placeholder')}
        className="flex-grow resize-none"
      />
    </PageLayout>
  );
};
