import React, {useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useRouter} from '@/navigation';
 import {Confetti} from '@/components/icons/confetti';
import {AstroGeco, AstroGecoWithStar} from '@/components/icons/astro-geco';

interface DialogViewProps {
  destinationRoute?: string;
  message?: string;
  icon?: string;
}

export default function DialogView({destinationRoute, message, icon}: DialogViewProps) {
  const router = useRouter();
  const handleDialogClose = () => {
    router.push(destinationRoute || '/');
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleDialogClose();
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="bg-pink">
        <DialogHeader className="flex h-full flex-col items-center justify-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-2xl font-bold text-black">
            <>
              {icon === 'feedback' && <Confetti />}
              {icon === 'signup' && <AstroGeco />}
              {icon === 'login' && <AstroGecoWithStar />}
              {message ? message : 'Thank you...!'}
            </>
          </DialogTitle>
          <DialogDescription className="font-family-j"></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
