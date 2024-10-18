'use client';

import {Confetti} from '@/components/icons/confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useRouter} from '@/navigation';
import {useDialog} from '@/store/useDialog';
import {useCallback, useEffect} from 'react';
import {AstroGeco, AstroGecoWithStar} from '../icons';

interface DialogViewProps {
  destinationRoute?: string;
  message?: string;
  icon?: string;
  description?: string;
  sticker?: React.ReactNode;
  className?: string;
}

export default function DialogView({
  destinationRoute,
  message,
  icon,
  description,
  sticker,
  className,
}: DialogViewProps) {
  const router = useRouter();
  const {setIsDialogOpen} = useDialog();
  const handleDialogClose = useCallback(() => {
    router.push(destinationRoute || '/');
    setIsDialogOpen(false);
  }, [router, destinationRoute, setIsDialogOpen]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleDialogClose();
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent
        className={`${className?.includes('bg-') ? className : `bg-blue ${className}`}`}>
        <DialogHeader className="flex h-full flex-col items-center justify-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-2xl font-bold text-black">
            {/* <>
              {icon === 'feedback' && <Confetti />}
              {icon === 'signup' && <AstroGeco />}
              {icon === 'login' && <AstroGecoWithStar />}
              </> */}
            {message ? message : 'Thank you...!'}
            {sticker && sticker}
          </DialogTitle>
          {description && (
            <DialogDescription className="font-family-j">{description}</DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
