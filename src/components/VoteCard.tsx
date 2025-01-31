import {ExerciseStage} from '@/lib/types';
import {cn} from '@/lib/utils';
import {Card, CardContent} from './ui/card';

export const VoteCard = ({
  text,
  type = 'start',
  vote = {
    yes: 0,
    no: 0,
  },
}: {
  text: string;
  type?: ExerciseStage;
  vote: {
    yes: number;
    no: number;
  };
}) => {
  return (
    <Card
      className={cn(
        type === 'start'
          ? 'bg-yellow-deactivated'
          : type === 'stop'
            ? 'bg-red-deactivated'
            : 'bg-green-deactivated',
        'h-fit min-h-32 flex flex-col justify-center items-center relative ',
      )}>
      <div className="absolute -top-4 left-0 w-full flex flex-row justify-center items-center gap-4 ">
        <div className="border-2 border-black bg-red rounded-4xl px-3 py-1 text-xl font-bold ">
          -{vote.no}
        </div>
        <div className="border-2 border-black bg-green rounded-4xl px-3 py-1 text-xl font-bold ">
          +{vote.yes}
        </div>
      </div>

      <CardContent className="!pt-8 relative">
        <h3 className="text-center font-bold text-xl">{text}</h3>
      </CardContent>
    </Card>
  );
};
