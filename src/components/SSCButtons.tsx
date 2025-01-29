'use client';
import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

export const SSCButtons = ({
  disableClick = false,
  selectedStage,
  onClick,
}: {
  disableClick?: boolean;
  selectedStage?: ExerciseStage;
  onClick?: (stage: ExerciseStage) => void;
}) => {
  const [stage, setStage] = useState<ExerciseStage>(selectedStage ?? 'start');
  const t = useTranslations();
  const chapters = t.raw(`exercises.ssc.chapters`);

  return (
    <div className="flex flex-row items-center justify-between h-fit gap-2 ">
      {Object.keys(chapters).map((chapter: string, index: number) => (
        <button
          key={index}
          className={cn(
            chapter !== stage ? 'opacity-60' : '',
            chapter === 'start' ? 'bg-yellow' : '',
            chapter === 'stop' ? 'bg-red' : '',
            chapter === 'continue' ? 'bg-green' : '',
            disableClick ? 'pointer-events-none' : '',
            'px-4 md:px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black disabled:opacity-50 disabled:pointer-events-none',
          )}
          onClick={() => {
            setStage(chapter as ExerciseStage);
            onClick?.(chapter as ExerciseStage);
          }}>
          {t(`ssc.chapters.${chapter}`)}
        </button>
      ))}
    </div>
  );
};
