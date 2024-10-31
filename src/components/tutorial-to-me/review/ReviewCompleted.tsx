import {FC} from 'react';

const ReviewCompleted: FC<{message: string}> = ({message}) => {
  return (
    <div className="simple-text">
      <h2>Review Completed</h2>
      <p>{message}</p>
    </div>
  );
};

export default ReviewCompleted;
