import {ExerciseType} from '@/lib/types';

export const getReviewAnswers = (chapter: string, exercises: ExerciseType[]) => {
  let answers;
  if (chapter === 'strength') {
    answers = exercises.map((e) => ({
      answers: e.answers.strengths.split(','),
      replyId: e.replied_id,
    }));
    answers.unshift({
      answers: ['start'],
      replyId: '',
    });

    answers.push({
      answers: [''],
      replyId: '',
    });
  } else if (chapter === 'weakness') {
    answers = exercises.map((e) => ({
      answers: e.answers.weaknesses.split(','),
      replyId: e.replied_id,
    }));
    answers.unshift({
      answers: ['start'],
      replyId: '',
    });

    answers.push({
      answers: [''],
      replyId: '',
    });
  } else if (chapter === 'communication') {
    answers = exercises.map((e) => ({
      answers: e.answers.communications.split(','),
      replyId: e.replied_id,
    }));
    answers.unshift({
      answers: ['start'],
      replyId: '',
    });

    answers.push({
      answers: [''],
      replyId: '',
    });
  }
  return answers ? answers : [];
};
