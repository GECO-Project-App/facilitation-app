import {Button} from '@/components/ui';
import {Link} from '@/i18n/routing';
import {Step} from '@/lib/types';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC} from 'react';

const ReviewCompleted: FC = () => {
  const t = useTranslations('exercises.tutorialToMe');
  const steps: Step[] = t.raw('steps').map((step: Step) => step);

  const background: (index: number) => string = (index: number) => {
    if (index === 0) return 'bg-yellow';
    if (index === 1) return 'bg-pink';
    if (index === 2) return 'bg-orange';
    return '';
  };

  return (
    <section className="flex flex-col h-min-full">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={`${background(index)} border-t-2 border-black ${index === steps.length - 1 ? 'border-b-2' : ''}`}>
          <h4 className="text-2xl font-bold p-4">{step.title}</h4>
          <p className="p-4">
            {t('takeALookAtYourTeammates')}
            <span className="font-bold">&nbsp;{step.title}&nbsp;</span>
            {t('preferences')}
          </p>
          <div className="flex justify-center pb-8">
            <Button variant="white" asChild className="h-12">
              <Link href={`./${step.title.toLowerCase()}`}>
                {t('letsGetStarted')}
                <ArrowRight size={32} />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReviewCompleted;
