import {ExerciseType} from '@/lib/types';

type ChapterKey = 'strengths' | 'weaknesses' | 'communications';

const CHAPTER_MAPPING: Record<string, ChapterKey> = {
  strength: 'strengths',
  weakness: 'weaknesses',
  communication: 'communications',
};

export const getReviewAnswers = (chapter: string, exercises: ExerciseType[]) => {
  const chapterKey = CHAPTER_MAPPING[chapter];

  if (!chapterKey) {
    return [];
  }

  const answers = exercises.map((exercise) => ({
    answers: exercise.answers[chapterKey].split(','),
    replyId: exercise.replied_id,
  }));

  // Add empty slides at start and end
  const emptySlide = {
    answers: [''],
    replyId: '',
  };

  return [emptySlide, ...answers, emptySlide];
};
