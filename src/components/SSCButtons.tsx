'use client';
import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {useLocalStore} from '@/store/localStore';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';

export const SSCButtons = () => {
  const t = useTranslations();
  const chapters = t.raw(`ssc.chapters`);
  const router = useRouter();
  const {exercise} = useExerciseStore();
  const {setStage, stage} = useLocalStore();

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
            'px-4 md:px-6 py-1 rounded-full font-semibold text-lg md:text-2xl border-2 border-black disabled:opacity-50 disabled:pointer-events-none',
          )}
          onClick={() => {
            setStage(chapter as ExerciseStage);
            if (exercise) {
              router.push(`ssc?id=${exercise.id}&status=${exercise.status}&stage=${chapter}`);
            }
          }}>
          {t(`ssc.chapters.${chapter}`)}
        </button>
      ))}
    </div>
  );
};
