'use client';

import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {UpdateTeamForm} from '../forms/UpdateTeamForm';
import {EditTeam} from '../icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui';

export const EditTeamDialog = () => {
  const {currentTeam, currentTeamId, isFacilitator} = useTeamStore();
  const t = useTranslations('team.edit');
  const [open, setOpen] = useState(false);
  if (!currentTeam || currentTeamId === 'new' || !isFacilitator) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="white" size="xs" className=" ">
            {t('title')} <EditTeam />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          <UpdateTeamForm currentTeam={currentTeam} onComplete={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
