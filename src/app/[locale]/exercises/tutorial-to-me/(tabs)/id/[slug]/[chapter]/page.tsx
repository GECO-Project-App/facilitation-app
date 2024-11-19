import ReviewAnswers from '@/components/tutorial-to-me/review/ReviewAnswers';
import {useTranslations} from 'next-intl';
export default function PreferencesPage({params}: {params: {slug: string; chapter: string}}) {
  const {slug, chapter} = params;
  const t = useTranslations('tutorialToMe');

  return (
    <section
      className={`w-full h-dvh ${chapter === 'strength' ? 'bg-yellow' : chapter === 'weakness' ? 'bg-pink' : 'bg-orange'} text-white`}>
      <ReviewAnswers chapter={chapter} />
    </section>
  );
}
