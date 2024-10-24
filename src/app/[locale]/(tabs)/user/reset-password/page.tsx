import {PageLayout, ResetPasswordForm} from '@/components';
import {getTranslations} from 'next-intl/server';

export default async function ResetPasswordPage() {
  const t = await getTranslations('authenticate');
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const locale = currentPath.split('/')[1]; // Extract locale from the current path
  //   const redirectToPage = `${window.location.origin}/${locale}/user/update-password`;
  //   try {
  //     const supabase = createClient();
  //     const {error} = await supabase.auth.resetPasswordForEmail(userEmail, {
  //       redirectTo: redirectToPage,
  //     });
  //     if (error) throw error;
  //     toast({
  //       title: t('emailSent'),
  //       description: t('emailSentDescription'),
  //     });
  //     setUserEmail('');
  //   } catch (error) {
  //     console.error('Error resetting password:', error);
  //     toast({
  //       title: t('error'),
  //       description: t('errorDescription'),
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <PageLayout>
      <section className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">{t('resetPassword')}</h2>
        <ResetPasswordForm />
      </section>
    </PageLayout>
  );
}
