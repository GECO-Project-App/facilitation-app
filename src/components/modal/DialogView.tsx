import {Confetti} from '@/components/icons/confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useRouter} from '@/navigation';
import {useCallback, useEffect} from 'react';

interface DialogViewProps {
  destinationRoute?: string;
}

export default function DialogView({destinationRoute}: DialogViewProps) {
  const router = useRouter();
  const handleDialogClose = useCallback(() => {
    router.push(destinationRoute || '/');
  }, [router, destinationRoute]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDialogClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [handleDialogClose]);

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="bg-pink">
        <DialogHeader className="flex h-full flex-col items-center justify-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-2xl font-bold text-black">
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
