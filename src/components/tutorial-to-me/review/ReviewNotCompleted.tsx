import {FC} from 'react';

const ReviewNotCompleted: FC<{message: string}> = ({message}) => {
  return (
    <div className="simple-text">
      <h2>Review Is Not Completed</h2>
      <p>{message}</p>
    </div>
  );
};

export default ReviewNotCompleted;
