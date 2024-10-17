import {Button} from './ui/button';

export const InviteCodeCard = () => {
  return (
    <div className="max-w-xs mx-auto py-6 px-4 rounded-4xl border-2 border-black flex flex-col items-center  h-fit bg-green gap-4">
      <h3 className="font-bold text-xl">Invite code</h3>
      <Button variant="white" size="xs" className=" justify-between w-full ">
        Invite team members
      </Button>
    </div>
  );
};
