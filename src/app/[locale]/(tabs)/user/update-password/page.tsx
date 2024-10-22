'use client';
import {PageLayout} from '@/components';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/useToast';
import {supabase} from '@/lib/supabase/client';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

const UpdatePassword = () => {
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive',
      });
      return;
    }
    try {
      const {error} = await supabase.auth.updateUser({
        email: email,
        password: newPassword,
      });
      if (error) throw error;
      setEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: t('error'),
        description: t('errorDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(value);
        break;
    }
  };

  return (
    <PageLayout>
      <form onSubmit={handleSubmit} className="flex min-h-[448px] h-fit flex-col justify-between">
        <div className="flex flex-col gap-4 items-center py-10">
          <h1 className="text-2xl font-bold">{t('updatePassword')}</h1>
          <p className="text-sm text-gray-500">{t('updatePasswordDescription')}</p>
        </div>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <Input
              id="signup-password"
              name="newPassword"
              type="password"
              placeholder={t('enterPassword')}
              value={newPassword}
              onChange={handleChange}
              required
              className="h-12 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="signup-confirm-password"
              name="confirmNewPassword"
              type="password"
              placeholder={t('confirmPassword')}
              value={confirmNewPassword}
              onChange={handleChange}
              required
              className="h-12 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder={t('enterEmail')}
              value={email}
              onChange={handleChange}
              required
              className="h-12 rounded-full"
            />
          </div>
        </div>
        <div className="mt-14 flex justify-center pb-6">
          <Button type="submit">{t('reset')}</Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default UpdatePassword;
