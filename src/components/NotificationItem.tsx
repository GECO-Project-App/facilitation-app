import {Check, X} from 'lucide-react';
import {Button} from './ui';

export const NotificationItem = () => {
  return (
    <div className="border-2 border-black rounded-4xl bg-white p-4 shadow-dark flex flex-col gap-4">
      <p>Notification</p>
      <div className="flex  flex-row justify-between">
        <Button variant="red" className="rounded-full aspect-square" size="xs">
          <X />
        </Button>
        <Button variant="green" className="rounded-full aspect-square" size="xs">
          <Check />
        </Button>
      </div>
    </div>
  );
};
