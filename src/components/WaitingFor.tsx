import {useRouter} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import {FC, ReactNode} from 'react';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui/button';

type WaitingForProps = {
  deadline: Date;
  text: string | ReactNode;
};

export const WaitingFor: FC<WaitingForProps> = ({deadline, text}) => {
  const router = useRouter();
  const t = useTranslations('common');

  return (
    <PageLayout
      header={<Header rightContent={<DateBadge date={deadline} />} />}
      footer={
        <Button variant="pink" onClick={() => router.back()}>
          {t('goBack')}
        </Button>
      }>
      <RiveAnimation src="timer.riv" width={'100%'} height={200} />

      <h3>{text}</h3>
    </PageLayout>
  );
};
