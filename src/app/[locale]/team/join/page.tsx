'use client';
import {WrongUserAlert} from '@/components/WrongUserAlert';
import {useToast} from '@/hooks/useToast';
import {acceptTeamInvitation, joinTeamByInviteLink} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
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

  useEffect(() => {
    const handleJoin = async () => {
      if (!invitation && !inviteLink) {
        router.push('/team');
        return;
      }

      const supabase = createClient();
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          variant: 'destructive',
          title: t('error.title'),
          description: t('error.notLoggedIn'),
        });
        router.push('/auth/login');
        return;
      }

      if (invitation) {
        const {data: invitationData, error: inviteError} = await supabase
          .from('team_invitations')
          .select('email')
          .eq('id', invitation)
          .single();

        if (inviteError || !invitationData) {
          toast({
            variant: 'destructive',
            title: t('error.title'),
            description: t('error.invalidInvitation'),
          });
          router.push('/team');
          return;
        }

        if (user.email?.toLowerCase() !== invitationData.email.toLowerCase()) {
          setWrongUser(true);
          return;
        }
      }

      const result = invitation
        ? await acceptTeamInvitation(invitation)
        : await joinTeamByInviteLink(inviteLink!);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: t('error.title'),
          description: result.error,
        });
        router.push('/team');
      } else {
        toast({
          variant: 'success',
          title: t('toast.joined'),
        });
        router.replace(`/team?id=${result.teamId}`);
      }
    };

    handleJoin();
  }, [invitation, inviteLink, router, toast, t, signOut]);

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
