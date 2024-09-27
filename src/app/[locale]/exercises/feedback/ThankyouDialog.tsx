import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Confetti } from "@/components/icons/confetti"
export default function ThankyouDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="bg-pink">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-black">Thank you for your feedback!</DialogTitle>
      <DialogDescription className="font-family-j">
        <Confetti />
        <h2>
            Thank you for your feedback!
            </h2>
      </DialogDescription>
    </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
