import {AvatarBuilder, PageLayout} from '@/components';

export default function TeamMemberPage() {
  return (
    <PageLayout>
      <section>
        <div className="flex flex-col gap-4">
          <AvatarBuilder />
        </div>
      </section>
    </PageLayout>
  );
}
