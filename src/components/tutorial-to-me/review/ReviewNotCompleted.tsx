import {RiveAnimation} from '@/components/RiveAnimation';
import {FC} from 'react';

const ReviewNotCompleted: FC = () => {
  return (
    <div className="simple-text">
      <h2>Waiting...</h2>
      <RiveAnimation src="timer.riv" width={300} height={300} />
      <p>
        We are still waiting on others, to finish their Tutorial to me. We will send you an email
        once everyone has completed their exercise, so you can come back here and review everyone
        else answers.
      </p>
    </div>
  );
};

export default ReviewNotCompleted;
