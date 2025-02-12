'use client';
import {WrongUserAlert} from '@/components/WrongUserAlert';
import {useToast} from '@/hooks/useToast';
import {acceptTeamInvitation} from '@/lib/actions/emailActions';
import {createClient} from '@/lib/supabase/client';
import {useUserStore} from '@/store/userStore';
import {Loader2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function JoinTeamPage() {
  const router = useRouter();
  const invitation = useSearchParams().get('invitation');
  const [wrongUser, setWrongUser] = useState(false);
  const {toast} = useToast();
  const t = useTranslations('team');
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
          title: t('error.notLoggedIn'),
        });
        router.push('/settings');
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
          title: t('error.invalidInvitation'),
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
        if (result.error === 'Email mismatch') {
          setWrongUser(true);
          return;
        }

        toast({
          variant: 'destructive',
          title: t('error.invalidInvitation'),
          description: result.error,
        });
        router.push('/team');
      } else {
        toast({
          title: t('toast.joined'),
          description: t('toast.joinedDescription'),
        });
        router.push(`/team?teamId=${result.teamId}`);
      }
    };

    handleInvitation();
  }, [invitation, router, toast, t]);

  if (wrongUser) {
    return (
      <WrongUserAlert
        isOpen={wrongUser}
        onCancel={() => router.push('/team')}
        onAction={() => {
          signOut();
          router.push('/settings');
        }}
        title={t('error.wrongUser')}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
