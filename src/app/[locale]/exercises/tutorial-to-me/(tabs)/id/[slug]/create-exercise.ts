import {createTutorialToMe} from '@/lib/actions/createTutorialToMeActions';
import {useTutorialToMe} from '@/store/useTutorialToMe';
interface CreateExerciseProps {
  strengths: string[];
  weaknesses: string[];
  communications: string[];
  team_id: string;
}

// function getTime(date: Date, time: string) {
//   return `${date.toISOString().split('T')[0]} ${time}`;
// }

export async function createExercise(data: CreateExerciseProps) {
  const {writingDate, writingTime, reviewingDate, reviewingTime} = useTutorialToMe.getState();
  // const writingDateAndTime = writingDate && writingTime ? getTime(writingDate, writingTime) : '';
  // const reviewingDateAndTime =
  //   reviewingDate && reviewingTime ? getTime(reviewingDate, reviewingTime) : '';

  const saveData = {
    team_id: data.team_id,
    writing_date: writingDate?.toISOString().split('T')[0] ?? '',
    writing_time: writingTime ?? '',
    reviewing_date: reviewingDate?.toISOString().split('T')[0] ?? '',
    reviewing_time: reviewingTime ?? '',
    strengths: data.strengths.join(','),
    weaknesses: data.weaknesses.join(','),
    communications: data.communications.join(','),
  };
  console.log('saveData =>', saveData);
  await createTutorialToMe(saveData);
}
