'use client';
import {useToast} from '@/hooks/useToast';
import {useTeamStore} from '@/store/teamStore';
import {Copy} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRef} from 'react';
import {Button} from './ui/button';

export const InviteCodeCard = () => {
  const t = useTranslations('team.page');
  const btnRef = useRef<HTMLButtonElement>(null);
  const {toast} = useToast();
  const {currentTeam, currentTeamId} = useTeamStore();

  const copyCode = () => {
    navigator.clipboard
      .writeText(btnRef.current?.textContent || '')
      .then(() => {
        toast({
          variant: 'success',
          title: t('copied'),
          description: t('copiedDescription'),
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  if (!currentTeam || currentTeamId === 'new') return null;

  return (
    <div className=" py-6 px-4 rounded-4xl border-2 border-black flex flex-col items-center h-fit bg-green gap-4">
      <p className="font-bold">{t('inviteCode')}:</p>
      <Button
        variant="noShadow"
        size="xs"
        className=" text-center w-full bg-white relative"
        ref={btnRef}
        onClick={copyCode}>
        {currentTeam?.team_code ?? ''} <Copy className="absolute right-4" size={20} />
      </Button>
      {/* TODO: Add invite team button when emails are implemented */}
      {/* <Button variant="white" size="xs" className=" justify-between w-full ">
        {t('inviteTeam')} <InviteTeam />
      </Button> */}
    </div>
  );
};
