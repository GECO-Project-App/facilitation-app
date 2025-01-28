'use client';
import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

export const SSCButtons = ({
  disableClick = false,
  onClick,
}: {
  disableClick?: boolean;
  onClick?: () => void;
}) => {
  const t = useTranslations();
  const chapters = t.raw(`exercises.ssc.chapters`);
  const searchParams = useSearchParams();
  const stage = searchParams.get('stage') as ExerciseStage;

  return (
    <div className="flex flex-row items-center justify-between h-fit gap-2 ">
      {Object.keys(chapters).map((chapter: string, index: number) => (
        <button
          key={index}
          onClick={onClick}
          className={cn(
            chapter !== stage ? 'opacity-60' : '',
            chapter === 'start' ? 'bg-yellow' : '',
            chapter === 'stop' ? 'bg-red' : '',
            chapter === 'continue' ? 'bg-green' : '',
            disableClick ? 'pointer-events-none' : '',
            'px-4 md:px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black disabled:opacity-50 disabled:pointer-events-none',
          )}>
          {t(`ssc.chapters.${chapter}`)}
        </button>
      ))}
    </div>
  );
};
