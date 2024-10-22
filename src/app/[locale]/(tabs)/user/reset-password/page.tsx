'use client';
import {PageLayout} from '@/components';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/useToast';
import {usePathname} from '@/i18n/routing';
import {supabase} from '@/lib/supabase/supabaseClient';
import {RefreshCcw} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

const ResetPassword = () => {
  const currentPath = usePathname();
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const locale = currentPath.split('/')[1]; // Extract locale from the current path
    const redirectToPage = `${window.location.origin}/${locale}/user/update-password`;
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: redirectToPage,
      });
      if (error) throw error;
      toast({
        title: t('emailSent'),
        description: t('emailSentDescription'),
      });
      setUserEmail('');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: t('error'),
        description: t('errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setUserEmail(value);
  };

  return (
    <PageLayout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex h-fit min-h-[448px] max-w-[600px] flex-col justify-between">
        <div className="space-y-6 px-4">
          <h2 className="text-center text-2xl font-bold">{t('resetPassword')}</h2>
          <div className="space-y-2">
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder={t('enterEmail')}
              value={userEmail}
              onChange={handleChange}
              required
              className="h-12 rounded-full"
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-14 flex justify-center pb-6">
          <Button type="submit" disabled={loading} variant="pink">
            {loading ? t('loading') : t('reset')} <RefreshCcw />
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default ResetPassword;
