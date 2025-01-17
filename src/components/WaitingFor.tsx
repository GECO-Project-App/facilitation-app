import {FC} from 'react';
import {DateBadge} from './DateBadge';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui/button';

type WaitingForProps = {
  people: string[];
  deadline: Date;
  onButtonClick?: () => void;
};

export const WaitingFor: FC<WaitingForProps> = ({people, deadline, onButtonClick}) => {
  return (
    <PageLayout
      header={
        <Header>
          <DateBadge date={deadline} />
        </Header>
      }
      footer={
        <Button variant="pink" onClick={onButtonClick}>
          Back to Menu
        </Button>
      }>
      <RiveAnimation src="timer.riv" width={'100%'} height={200} />

      <h1>Waiting for {people.join(', ')} to review</h1>
      {/* //TODO: Write function for fetching the names of the team members that we're waiting for */}
    </PageLayout>
  );
};
