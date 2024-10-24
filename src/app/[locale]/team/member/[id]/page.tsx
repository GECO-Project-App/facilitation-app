import {AvatarBuilder, Button, Header, PageLayout} from '@/components';
import {Save} from '@/components/icons';
import {getTranslations} from 'next-intl/server';

export default async function TeamMemberPage() {
  const t = await getTranslations('team.edit.avatar');

  return (
    <PageLayout
      header={<Header />}
      footer={
        <Button variant="green">
          {t('button')} <Save />
        </Button>
      }>
      <AvatarBuilder />
    </PageLayout>
  );
}
