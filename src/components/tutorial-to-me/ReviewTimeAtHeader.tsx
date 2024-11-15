import {useTutorialToMe} from '@/store/useTutorialToMe';

const ReviewTimeAtHeader = () => {
  const {reviewingDate, reviewingTime} = useTutorialToMe();

  if (!reviewingDate || !reviewingTime) return null;
  return (
    <div>
      <div className="bg-white rounded-full p-2 border border-black border-2 text-sm font-bold text-center w-fit mx-auto">
        <p>
          {reviewingDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <p>{reviewingTime}</p>
      </div>
    </div>
  );
};

export default ReviewTimeAtHeader;
