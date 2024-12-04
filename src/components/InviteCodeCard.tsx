'use client';
import {useToast} from '@/hooks/useToast';
import {shareInviteLink} from '@/lib/actions/teamActions';
import {useTeamStore} from '@/store/teamStore';
import {Copy, Rocket} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRef, useState} from 'react';
import {InviteTeamMemberDialog} from './dialogs';
import {Button} from './ui/button';

export const InviteCodeCard = () => {
  const t = useTranslations('team.page');
  const btnRef = useRef<HTMLButtonElement>(null);
  const {toast} = useToast();
  const {currentTeam, currentTeamId} = useTeamStore();
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleShareInvite = async () => {
    if (!currentTeam?.id) return;
    setIsGenerating(true);

    try {
      const result = await shareInviteLink(currentTeam.id);
      if (result.error || !result.inviteUrl) {
        toast({
          variant: 'destructive',
          title: t('error'),
          description: result.error,
        });
        return;
      }

      await navigator.clipboard.writeText(result.inviteUrl).then(() => {
        toast({
          variant: 'success',
          title: t('linkCopied'),
          description: t('inviteLinkCopied'),
        });
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('failedToGenerateLink'),
      });
    } finally {
      setIsGenerating(false);
    }
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

      <InviteTeamMemberDialog />
      <Button
        variant="white"
        size="xs"
        className="w-full justify-between"
        onClick={handleShareInvite}
        disabled={isGenerating}>
        {isGenerating ? t('generating') : t('shareInviteLink')} <Rocket />
      </Button>
    </div>
  );
};
