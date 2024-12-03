'use client';
import {WrongUserAlert} from '@/components/WrongUserAlert';
import {useToast} from '@/hooks/useToast';
import {acceptTeamInvitation} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function JoinTeamPage() {
  const searchParams = useSearchParams();
  const invitation = searchParams.get('invitation');
  const router = useRouter();
  const {toast} = useToast();
  const t = useTranslations('team');
  const [wrongUser, setWrongUser] = useState(false);

  const {signOut} = useUserStore();

  useEffect(() => {
    const handleInvitation = async () => {
      const supabase = createClient();
      if (!invitation) {
        router.push('/team');
        return;
      }

      // Get the current user's email
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

      // Get the invitation details
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

      // Check if the logged-in user matches the invited email
      if (user.email?.toLowerCase() !== invitationData.email.toLowerCase()) {
        setWrongUser(true);
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
          variant: 'success',
          title: t('toast.joined'),
        });
        router.replace(`/team?id=${result.teamId}`);
      }
    };

    handleInvitation();
  }, [invitation, router, toast, t]);

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
