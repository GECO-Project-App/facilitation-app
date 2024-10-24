import {Confetti} from '@/components/icons/confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useDialog} from '@/store/dialogStore';
import {AstroGeco, AstroGecoWithStar} from '../icons';

interface DialogViewProps {
  destinationRoute?: string;
  message?: string;
  icon?: string;
}

export default function DialogView({destinationRoute, message, icon}: DialogViewProps) {
  const {isOpen, onClose} = useDialog();

  return (
    <Dialog defaultOpen={isOpen} onOpenChange={onClose}>
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
