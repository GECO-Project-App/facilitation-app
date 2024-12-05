'use client';
import {WrongUserAlert} from '@/components/WrongUserAlert';
import {useToast} from '@/hooks/useToast';
import {acceptTeamInvitation, joinTeamByInviteLink} from '@/lib/actions/teamActions';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function JoinTeamPage() {
  const searchParams = useSearchParams();
  const invitation = searchParams.get('invitation');
  const inviteLink = searchParams.get('link');
  const router = useRouter();
  const {toast} = useToast();
  const t = useTranslations('team');
  const [wrongUser, setWrongUser] = useState(false);
  const {signOut} = useUserStore();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isActive = true;

    const processInvitation = async () => {
      if (!invitation && !inviteLink) {
        setIsProcessing(false);
        return;
      }

      try {
        if (!isActive) return;
        const result = invitation
          ? await acceptTeamInvitation(invitation)
          : await joinTeamByInviteLink(inviteLink!);

        if (!isActive) return;
        if (result.error) {
          toast({
            variant: 'destructive',
            title: result.error,
          });
          setIsProcessing(false);
          return;
        }

        toast({
          variant: 'success',
          title: t('success.title'),
          description: t('success.joined'),
        });
        router.replace(`/team?id=${result.teamId}`);
      } catch (error) {
        console.error('Invitation processing error:', error);
        setIsProcessing(false);
      }
    };

    processInvitation();

    return () => {
      isActive = false;
    };
  }, [invitation, inviteLink, router, t, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {wrongUser && (
        <WrongUserAlert
          isOpen={wrongUser}
          onCancel={() => router.push('/team')}
          onAction={() => {
            signOut();
            router.push('/settings');
          }}
          title={t('error.wrongUser')}
        />
      )}

      <div className="animate-pulse">{t('processing')}</div>
    </div>
  );
}
