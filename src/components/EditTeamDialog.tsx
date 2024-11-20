'use client';

import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {UpdateTeamForm} from './forms/UpdateTeamForm';
import {EditTeam} from './icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui';

export const EditTeamDialog = () => {
  const {currentTeam} = useTeamStore();
  const t = useTranslations('team.edit');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="noShadow" size="xs" className="aspect-square">
          <EditTeam />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <UpdateTeamForm currentTeam={currentTeam} />
      </DialogContent>
    </Dialog>
  );
};
