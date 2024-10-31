'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useRouter} from '@/i18n/routing';
import {useDialog} from '@/store/useDialog';
import {DialogProps} from '@radix-ui/react-dialog';
import {useCallback, useEffect} from 'react';

interface DialogViewProps extends DialogProps {
  destinationRoute?: string;
  message?: string;
  description?: string;
  sticker?: React.ReactNode;
  className?: string;
}

export default function DialogView({
  destinationRoute,
  message,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDialogClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [handleDialogClose]);

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent
        className={`${className?.includes('bg-') ? className : `bg-blue ${className}`}`}>
        <DialogHeader className="flex h-full flex-col items-center justify-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-2xl font-bold text-black">
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
