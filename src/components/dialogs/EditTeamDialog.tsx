'use client';

import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useMemo, useState} from 'react';
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
  const {isFacilitator, currentTeam} = useTeamStore();
  const t = useTranslations('team.edit');
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const teamId = searchParams.get('teamId');

  const showDialog = useMemo(() => {
    return teamId !== 'new' && isFacilitator;
  }, [teamId, isFacilitator]);

  return (
    <>
      {showDialog && (
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
      )}
    </>
  );
};
