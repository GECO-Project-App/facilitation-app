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
    <div className="flex flex-col h-min-full">
      {steps.slice(0, -1).map((step, index) => (
        <div key={step.title} className={`${background(index)} h-64`}>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold">{step.title}</h4>
          </div>
          <Button variant="white" asChild className="mx-auto">
            <Link href="#">
              Let’s Get Started
              <ArrowRight size={32} />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ReviewCompleted;
