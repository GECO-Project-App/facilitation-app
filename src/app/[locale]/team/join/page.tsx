'use client';
import {useToast} from '@/hooks/useToast';
import {acceptTeamInvitation} from '@/lib/actions/teamActions';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function JoinTeamPage() {
  const searchParams = useSearchParams();
  const invitation = searchParams.get('invitation');
  const router = useRouter();
  const {toast} = useToast();
  const t = useTranslations('team');

  useEffect(() => {
    const handleInvitation = async () => {
      if (!invitation) {
        router.push('/team');
        return;
      }

      const result = await acceptTeamInvitation(invitation);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: t('error.title'),
          description: result.error,
        });
        router.push('/team');
      } else {
        toast({
          title: t('toast.joined'),
          description: t('toast.joinedDescription'),
        });
        router.push(`/team?id=${result.teamId}`);
      }
    };

    handleInvitation();
  }, [invitation, router, toast, t]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Processing invitation...</div>
    </div>
  );
}
