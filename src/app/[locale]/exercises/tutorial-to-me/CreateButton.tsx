'use client';
import {Button} from '@/components/ui/button/button';
import {createTutorialToMe} from '@/lib/actions/tutorialToMeActions';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {ArrowRight} from 'lucide-react';
const CreateButton = ({title}: {title: string}) => {
  const {writingDate, writingTime, reviewingDate, reviewingTime, members} = useTutorialToMe();

  const getTimestamp = (date: Date | undefined, time: string | undefined) => {
    const d = date?.toISOString();
    const t = time;
    return `${d} ${t}`;
  };

  const handleClick = async () => {
    const writingTimestamp = getTimestamp(writingDate, writingTime);
    const reviewingTimestamp = getTimestamp(reviewingDate, reviewingTime);
    console.log('clicked', writingTimestamp, reviewingTimestamp);
    const array = members.map((member) => member.id);
    const data = {
      created_by: 'Cristian',
      members: array.join(','),
      writing_date: writingTimestamp,
      reviewing_date: reviewingTimestamp,
    };
    createTutorialToMe(data);
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
