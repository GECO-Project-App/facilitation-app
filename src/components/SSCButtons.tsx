'use client';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

export const SSCButtons = () => {
  const t = useTranslations();
  const [stage, setStage] = useState<'start' | 'stop' | 'continue'>('start');
  const chapters = t.raw(`ssc.chapters`);
  const {setReviewedStages} = useExerciseStore();
  return (
    <div className="flex flex-row items-center justify-between h-fit gap-2 ">
      {Object.keys(chapters).map((chapter: string, index: number) => (
        <button
          key={chapters}
          className={cn(
            chapter === 'start' ? 'bg-yellow' : '',
            chapter === 'stop' ? 'bg-red' : '',
            chapter === 'continue' ? 'bg-green' : '',
            'px-4 md:px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black disabled:opacity-50 disabled:pointer-events-none',
          )}
          disabled={stage !== chapter}
          onClick={() => setReviewedStages(chapter)}>
          {chapters[chapter]}
        </button>
      ))}
    </div>
  );
};
