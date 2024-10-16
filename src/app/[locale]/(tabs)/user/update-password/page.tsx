'use client';
import DialogView from '@/components/modal/DialogView';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/useToast';
import {supabase} from '@/lib/supabase/supabaseClient';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

const UpdatePassword = () => {
  const {toast} = useToast();
  const t = useTranslations('authenticate');
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive',
      });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        password: formData.newPassword,
      });
      if (error) throw error;
      setShowDialog(true);
      setFormData({ email: '', newPassword: '', confirmNewPassword: '' });
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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
        <form onSubmit={handleSubmit} className="flex min-h-[448px] h-fit flex-col justify-between">
            <div className="flex flex-col gap-4 items-center py-10">
                <h1 className="text-2xl font-bold">{t('updatePassword')}</h1>
                <p className="text-sm text-gray-500">{t('updatePasswordDescription')}</p>
            </div>
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder={t('enterPassword')}
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="h-12 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder={t('confirmPassword')}
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
                className="h-12 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder={t('confirmPassword')}
                value={formData.confirmNewPassword}
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
  );
};

export default UpdatePassword;
