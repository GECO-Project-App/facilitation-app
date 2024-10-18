import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface DialogStateType {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}

export const useDialog = create<DialogStateType>()(
  devtools(
    (set) => ({
      isDialogOpen: false,
      setIsDialogOpen: (isDialogOpen) => set({isDialogOpen}),
    }),
    {name: 'DialogStore'},
  ),
);

// import DialogView from '@/components/modal/DialogView';
// import {useEffect} from 'react';

// export const useDialogEffect = () => {
//   const isDialogOpen = useDialogStore((state) => state.isDialogOpen);

//   useEffect(() => {
//     if (isDialogOpen) {
//       return <DialogView destinationRoute="/" message={t('loggedIn')} icon="login" />;
//     }
//   }, [isDialogOpen]);
// };
