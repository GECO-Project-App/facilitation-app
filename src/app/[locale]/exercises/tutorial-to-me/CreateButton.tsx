'use client';
import {Button} from '@/components/ui/button/button';
import {createTutorialToMe} from '@/lib/actions/tutorialToMeActions';
import {useTeamStore} from '@/store/teamStore';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {ArrowRight} from 'lucide-react';
import {useRouter} from 'next/navigation';

const CreateButton = ({title}: {title: string}) => {
  const router = useRouter();
  const {writingDate, writingTime, reviewingDate, reviewingTime, members} = useTutorialToMe();
  const getTimestamp = (date: Date | undefined, time: string | undefined) => {
    const d = date?.toISOString();
    const t = time;
    return `${d} ${t}`;
  };
  const {currentTeam} = useTeamStore();
  const {userProfile} = useTeamStore();
  console.log('writingDate', writingDate);
  const handleClick = async () => {
    const writingTimestamp = getTimestamp(writingDate, writingTime);
    const reviewingTimestamp = getTimestamp(reviewingDate, reviewingTime);
    const tutorialData = {
      created_by: userProfile?.user_id || '',
      team_id: currentTeam?.id || '',
      writing_date: writingTimestamp,
      reviewing_date: reviewingTimestamp,
    };
    console.log('tutorialData', tutorialData);
    if (tutorialData.created_by && tutorialData.team_id) {
      createTutorialToMe(tutorialData).then((res) => {
        console.log('res', res);
        router.push(`/exercises/tutorial-to-me/id/${res?.[0].exercise_id}`);
      });
    }
  };

  return (
    <Button variant="blue" asChild className="mx-auto" onClick={handleClick}>
      <div className="flex items-center gap-2">
        {title} <ArrowRight size={28} />
      </div>
    </Button>
  );
};

export default CreateButton;
