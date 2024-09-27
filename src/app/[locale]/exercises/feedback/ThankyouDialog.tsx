import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useRouter} from '@/navigation';

import {Confetti} from '@/components/icons/confetti';

interface ThankyouDialogProps {
  destinationRoute: string;
}

export default function ThankyouDialog({destinationRoute}: ThankyouDialogProps) {
  const router = useRouter();
  const handleDialogClose = () => {
    router.push(destinationRoute);
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="bg-pink">
        <DialogHeader className="flex flex-col items-center justify-center h-full">
          <DialogTitle className="text-2xl font-bold text-black flex flex-col items-center gap-2">
            <>
              <Confetti />
              Thank you for your feedback!
            </>
          </DialogTitle>
          <DialogDescription className="font-family-j"></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
