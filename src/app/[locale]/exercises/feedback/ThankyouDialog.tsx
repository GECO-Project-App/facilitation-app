import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Confetti} from '@/components/icons/confetti';
export default function ThankyouDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
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
